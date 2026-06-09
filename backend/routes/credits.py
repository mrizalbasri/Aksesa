"""
Credits API Routes
Endpoints for managing user credits and subscriptions
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.dependencies import get_db
from services.auth_service import get_current_user, AuthUser
from services.credit_service import (
    get_user_credits,
    get_credit_history,
    upgrade_subscription,
)
from schemas.common import ErrorResponse


router = APIRouter(prefix="/api/v1/credits", tags=["Credits"])


@router.get(
    "/balance",
    summary="Get Credit Balance",
    description="Get current user's credit balance and subscription information",
    responses={
        200: {
            "description": "Credit balance retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "free_credits": 3,
                        "premium_credits": 0,
                        "total_credits": 3,
                        "subscription_tier": "free",
                        "is_premium": False,
                        "last_reset": "2024-01-15T10:30:00",
                        "next_reset": "2024-01-16T10:30:00"
                    }
                }
            }
        },
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    }
)
async def get_credits_balance(
    db: AsyncSession = Depends(get_db),
    user: AuthUser = Depends(get_current_user)
):
    """
    Get user's current credit balance
    
    Returns:
        - free_credits: Number of free credits available
        - premium_credits: Number of premium credits available
        - total_credits: Total credits (free + premium)
        - subscription_tier: Current subscription tier (free/basic/premium)
        - is_premium: Whether user has premium subscription
        - last_reset: Last time credits were reset
        - next_reset: Next scheduled credit reset time
    """
    return await get_user_credits(db, user.id)


@router.get(
    "/history",
    summary="Get Credit History",
    description="Get user's credit transaction history",
    responses={
        200: {
            "description": "Credit history retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "transactions": [
                            {
                                "id": "tx_123",
                                "action": "scoring",
                                "credits_used": 1,
                                "credits_remaining": 2,
                                "description": "Used 1 credit(s) for scoring",
                                "created_at": "2024-01-15T10:30:00"
                            }
                        ],
                        "total": 1,
                        "limit": 20,
                        "offset": 0
                    }
                }
            }
        },
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    }
)
async def get_credits_history_endpoint(
    limit: int = Query(20, ge=1, le=100, description="Number of transactions to return"),
    offset: int = Query(0, ge=0, description="Number of transactions to skip"),
    db: AsyncSession = Depends(get_db),
    user: AuthUser = Depends(get_current_user)
):
    """
    Get user's credit transaction history
    
    Query Parameters:
        - limit: Maximum number of transactions to return (1-100, default: 20)
        - offset: Number of transactions to skip (default: 0)
    
    Returns:
        List of credit transactions with details
    """
    transactions = await get_credit_history(db, user.id, limit, offset)
    
    return {
        "transactions": transactions,
        "total": len(transactions),
        "limit": limit,
        "offset": offset
    }


@router.post(
    "/upgrade",
    summary="Upgrade Subscription",
    description="Upgrade user's subscription tier (admin only for now)",
    responses={
        200: {
            "description": "Subscription upgraded successfully",
            "content": {
                "application/json": {
                    "example": {
                        "free_credits": 3,
                        "premium_credits": 100,
                        "total_credits": 103,
                        "subscription_tier": "premium",
                        "is_premium": True
                    }
                }
            }
        },
        400: {"model": ErrorResponse, "description": "Invalid tier"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    }
)
async def upgrade_subscription_endpoint(
    tier: str = Query(..., description="New subscription tier (free/basic/premium)"),
    credits: int = Query(0, ge=0, description="Additional premium credits to add"),
    db: AsyncSession = Depends(get_db),
    user: AuthUser = Depends(get_current_user)
):
    """
    Upgrade user's subscription tier
    
    Query Parameters:
        - tier: New subscription tier (free, basic, premium)
        - credits: Additional premium credits to add (optional)
    
    Returns:
        Updated credit balance and subscription info
    
    Note: In production, this should be protected and only callable
    after payment verification. For demo purposes, it's open to all users.
    """
    return await upgrade_subscription(db, user.id, tier, credits)
