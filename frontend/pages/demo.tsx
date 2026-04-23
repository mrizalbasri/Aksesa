import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DEMO_PROFILES } from "@/lib/demoData";

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf6] to-[#f5f1ec] py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#111111] sm:text-5xl">
            Aksesa Demo Profiles
          </h1>
          <p className="mt-4 text-lg text-[#626260]">
            Explore sample UMKM profiles and see instant AI credit scoring
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {(
            Object.entries(DEMO_PROFILES) as Array<
              [
                keyof typeof DEMO_PROFILES,
                (typeof DEMO_PROFILES)[keyof typeof DEMO_PROFILES],
              ]
            >
          ).map(([key, profile]) => (
            <Card
              key={key}
              className="flex flex-col border-[#dedbd6] bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg">{profile.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-[#111111]">
                      Expected Score:
                    </span>
                    <p className="text-[#626260]">{profile.expectedScore}</p>
                  </div>
                  <div>
                    <span className="font-medium text-[#111111]">Risk Level:</span>
                    <p className="text-[#626260]">{profile.expectedRisk}</p>
                  </div>
                  <div>
                    <span className="font-medium text-[#111111]">Profile:</span>
                    <ul className="mt-1 space-y-1 text-[#626260]">
                      <li>Age: {profile.businessAge} years</li>
                      <li>Employees: {profile.employees}</li>
                      <li>Location: {profile.location}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <div className="border-t border-[#dedbd6] p-4">
                <Link href={`/scoring?demo=${key}`}>
                  <Button className="w-full bg-[#ff5600] hover:bg-[#e14b00] text-white">
                    Try This Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-12 border-[#cde7c3] bg-[#f4fbf1]">
          <CardHeader>
            <CardTitle className="text-[#2c6415]">How Demo Mode Works</CardTitle>
          </CardHeader>
          <CardContent className="text-[#2c6415]">
            <ol className="space-y-2 list-decimal list-inside">
              <li>Click a profile above</li>
              <li>Scoring form will auto-fill with sample data</li>
              <li>Upload any image file (required)</li>
              <li>Click Submit to see instant AI scoring</li>
              <li>View results, recommendations, and loan simulator</li>
            </ol>
          </CardContent>
        </Card>

        {/* Manual Entry Link */}
        <div className="mt-12 text-center">
          <Link href="/scoring">
            <Button variant="outline" className="border-[#111111] text-[#111111] hover:bg-[#fcfaf7]">
              Start with Manual Entry
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
