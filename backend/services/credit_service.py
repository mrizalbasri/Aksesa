"""
Credit Management Service
Handles user credits, subscriptions, and usage tracking
"""

from datetime import datetime, timedelta
from typing import Optional
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import User, CreditTransaction, CreditAction, SubscriptionTier
from services.errors import ServiceError


# Credit costs for different actions
CREDIT_COSTS = {
    "scoring": 1,
    "ocr": 1,
    "simulation": 0,  # Free for all users
}

# Free tier limits
FREE_TIER_LIMITS = {
    "daily_credits": 3,
    "welcome_bonus": 5,
}


async def check_and_deduct_credits(
    db: AsyncSession,
    user_id: str,
    action: str,
) -> bool:
    """
    Check if user has enough credits and deduct if available
    
    Args:
        db: Database session
        user_id: User ID
        action: Action type (scoring, ocr, simulation)
    
    Returns:
        True if credits were successfully deducted
    
    Raises:
        ServiceError: If user not found or insufficient credits
    """
    # Get user
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise ServiceError(
            code="USER_NOT_FOUND",
            message="User tidak ditemukan",
            status_code=404
        )
    
    # Premium users have unlimited credits
    if user.subscription_tier == SubscriptionTier.PREMIUM:
        await _log_credit_transaction(
            db=db,
            user_id=user_id,
            action=action,
            credits_used=0,
            credits_remaining=user.free_credits,
            description="Premium user - unlimited access"
        )
        return True
    
    # Check if daily reset is needed
    await _check_and_reset_daily_credits(db, user)
    
    # Get credit cost for action
    cost = CREDIT_COSTS.get(action, 1)
    
    # Check if user has enough credits
    total_credits = user.free_credits + user.premium_credits
    if total_credits < cost:
        raise ServiceError(
            code="INSUFFICIENT_CREDITS",
            message=f"Kredit tidak cukup. Anda membutuhkan {cost} kredit, tersisa {total_credits}. "
                   f"Upgrade ke Premium untuk unlimited scoring!",
            status_code=402  # Payment Required
        )
    
    # Deduct credits (use premium credits first, then free credits)
    if user.premium_credits >= cost:
        user.premium_credits -= cost
    else:
        remaining_cost = cost - user.premium_credits
        user.premium_credits = 0
        user.free_credits -= remaining_cost
    
    # Log transaction
    await _log_credit_transaction(
        db=db,
        user_id=user_id,
        action=action,
        credits_used=cost,
        credits_remaining=user.free_credits + user.premium_credits,
        description=f"Used {cost} credit(s) for {action}"
    )
    
    await db.commit()
    return True


async def grant_welcome_bonus(db: AsyncSession, user_id: str) -> None:
    """
    Grant welcome bonus credits to new users
    
    Args:
        db: Database session
        user_id: User ID
    """
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        return
    
    # Grant welcome bonus
    user.free_credits = FREE_TIER_LIMITS["welcome_bonus"]
    user.last_credit_reset = datetime.utcnow()
    
    # Log bonus transaction
    await _log_credit_transaction(
        db=db,
        user_id=user_id,
        action="bonus",
        credits_used=-FREE_TIER_LIMITS["welcome_bonus"],  # Negative = credit added
        credits_remaining=user.free_credits,
        description=f"Welcome bonus: {FREE_TIER_LIMITS['welcome_bonus']} free credits"
    )
    
    await db.commit()


async def get_user_credits(db: AsyncSession, user_id: str) -> dict:
    """
    Get user's current credit balance and subscription info
    
    Args:
        db: Database session
        user_id: User ID
    
    Returns:
        Dictionary with credit balance and subscription details
    
    Raises:
        ServiceError: If user not found
    """
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise ServiceError(
            code="USER_NOT_FOUND",
            message="User tidak ditemukan",
            status_code=404
        )
    
    # Calculate next reset time
    next_reset = None
    if user.last_credit_reset:
        next_reset = user.last_credit_reset + timedelta(days=1)
    
    return {
        "free_credits": user.free_credits,
        "premium_credits": user.premium_credits,
        "total_credits": user.free_credits + user.premium_credits,
        "subscription_tier": user.subscription_tier.value,
        "is_premium": user.subscription_tier == SubscriptionTier.PREMIUM,
        "last_reset": user.last_credit_reset.isoformat() if user.last_credit_reset else None,
        "next_reset": next_reset.isoformat() if next_reset else None,
    }


async def get_credit_history(
    db: AsyncSession,
    user_id: str,
    limit: int = 20,
    offset: int = 0
) -> list[dict]:
    """
    Get user's credit transaction history
    
    Args:
        db: Database session
        user_id: User ID
        limit: Maximum number of transactions to return
        offset: Number of transactions to skip
    
    Returns:
        List of credit transactions
    """
    stmt = (
        select(CreditTransaction)
        .where(CreditTransaction.user_id == user_id)
        .order_by(CreditTransaction.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    
    result = await db.execute(stmt)
    transactions = result.scalars().all()
    
    return [
        {
            "id": tx.id,
            "action": tx.action.value,
            "credits_used": tx.credits_used,
            "credits_remaining": tx.credits_remaining,
            "description": tx.description,
            "created_at": tx.created_at.isoformat(),
        }
        for tx in transactions
    ]


async def upgrade_subscription(
    db: AsyncSession,
    user_id: str,
    tier: str,
    credits_to_add: int = 0
) -> dict:
    """
    Upgrade user's subscription tier
    
    Args:
        db: Database session
        user_id: User ID
        tier: New subscription tier (free, basic, premium)
        credits_to_add: Additional premium credits to add
    
    Returns:
        Updated user credit info
    
    Raises:
        ServiceError: If user not found or invalid tier
    """
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise ServiceError(
            code="USER_NOT_FOUND",
            message="User tidak ditemukan",
            status_code=404
        )
    
    # Validate tier
    try:
        new_tier = SubscriptionTier(tier)
    except ValueError:
        raise ServiceError(
            code="INVALID_TIER",
            message=f"Tier tidak valid: {tier}",
            status_code=400
        )
    
    # Update subscription
    old_tier = user.subscription_tier
    user.subscription_tier = new_tier
    
    # Add premium credits if provided
    if credits_to_add > 0:
        user.premium_credits += credits_to_add
        
        await _log_credit_transaction(
            db=db,
            user_id=user_id,
            action="purchase",
            credits_used=-credits_to_add,  # Negative = credit added
            credits_remaining=user.free_credits + user.premium_credits,
            description=f"Purchased {credits_to_add} premium credits"
        )
    
    # Log subscription change
    await _log_credit_transaction(
        db=db,
        user_id=user_id,
        action="bonus",
        credits_used=0,
        credits_remaining=user.free_credits + user.premium_credits,
        description=f"Subscription upgraded from {old_tier.value} to {new_tier.value}"
    )
    
    await db.commit()
    
    return await get_user_credits(db, user_id)


async def _check_and_reset_daily_credits(db: AsyncSession, user: User) -> None:
    """
    Check if daily credit reset is needed and reset if necessary
    
    Args:
        db: Database session
        user: User object
    """
    if not user.last_credit_reset:
        # First time - set reset time
        user.last_credit_reset = datetime.utcnow()
        return
    
    # Check if 24 hours have passed
    hours_since_reset = (datetime.utcnow() - user.last_credit_reset).total_seconds() / 3600
    
    if hours_since_reset >= 24:
        # Reset daily credits
        old_credits = user.free_credits
        user.free_credits = FREE_TIER_LIMITS["daily_credits"]
        user.last_credit_reset = datetime.utcnow()
        
        # Log reset
        await _log_credit_transaction(
            db=db,
            user_id=user.id,
            action="bonus",
            credits_used=-(user.free_credits - old_credits),  # Negative = credit added
            credits_remaining=user.free_credits + user.premium_credits,
            description=f"Daily credit reset: {FREE_TIER_LIMITS['daily_credits']} free credits"
        )


async def _log_credit_transaction(
    db: AsyncSession,
    user_id: str,
    action: str,
    credits_used: int,
    credits_remaining: int,
    description: Optional[str] = None
) -> None:
    """
    Log a credit transaction
    
    Args:
        db: Database session
        user_id: User ID
        action: Action type
        credits_used: Number of credits used (negative for credits added)
        credits_remaining: Credits remaining after transaction
        description: Optional description
    """
    transaction = CreditTransaction(
        id=str(uuid.uuid4()),
        user_id=user_id,
        action=CreditAction(action),
        credits_used=credits_used,
        credits_remaining=credits_remaining,
        description=description,
        created_at=datetime.utcnow()
    )
    
    db.add(transaction)
