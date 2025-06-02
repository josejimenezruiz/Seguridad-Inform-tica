import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink } from "lucide-react"

interface Link {
  url: string
  displayText: string
  isSuspicious: boolean
  reason: string
  riskLevel: "high" | "medium" | "low" | "safe"
}

interface LinkAnalysisTableProps {
  links: Link[]
}

export default function LinkAnalysisTable({ links }: LinkAnalysisTableProps) {
  if (!links || links.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis de enlaces</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No se encontraron enlaces en el contenido del correo.</p>
        </CardContent>
      </Card>
    )
  }

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Alto riesgo
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="warning" className="flex items-center gap-1 bg-amber-500">
            <AlertTriangle className="h-3 w-3" />
            Riesgo medio
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-300 bg-amber-50">
            <AlertTriangle className="h-3 w-3" />
            Riesgo bajo
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-300 bg-green-50">
            <CheckCircle2 className="h-3 w-3" />
            Seguro
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Análisis de enlaces ({links.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Texto visible</TableHead>
              <TableHead>URL real</TableHead>
              <TableHead>Nivel de riesgo</TableHead>
              <TableHead>Motivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{link.displayText || "(Sin texto)"}</TableCell>
                <TableCell className="font-mono text-xs break-all">{link.url}</TableCell>
                <TableCell>{getRiskBadge(link.riskLevel)}</TableCell>
                <TableCell className="text-sm text-gray-600">{link.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
