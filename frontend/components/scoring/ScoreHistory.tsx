import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockHistory = [
  { date: "2026-03-15", score: 68, status: "Risiko Sedang" },
  { date: "2026-02-10", score: 62, status: "Risiko Sedang" },
  { date: "2026-01-12", score: 55, status: "Risiko Sedang" },
];

const getBadgeVariant = (status: string) => {
  switch (status) {
    case "Layak Kredit":
      return "default";
    case "Risiko Sedang":
      return "secondary";
    case "Risiko Tinggi":
      return "destructive";
    default:
      return "outline";
  }
};

const ScoreHistory = () => {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-white">Riwayat Skor</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Tanggal</TableHead>
            <TableHead className="text-white">Skor</TableHead>
            <TableHead className="text-right text-white">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockHistory.map((item) => (
            <TableRow key={item.date}>
              <TableCell className="font-medium">{item.date}</TableCell>
              <TableCell>{item.score}</TableCell>
              <TableCell className="text-right">
                <Badge variant={getBadgeVariant(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScoreHistory;
