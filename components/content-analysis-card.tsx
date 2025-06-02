import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, XCircle, FileText } from "lucide-react"

interface ContentAnalysisCardProps {
  analysisResult: {
    contentAnalysis: {
      redFlags: {
        type: string
        description: string
        severity: "high" | "medium" | "low"
      }[]
      warningFlags: {
        type: string
        description: string
      }[]
      safeIndicators: {
        type: string
        description: string
      }[]
    }
  }
}

export default function ContentAnalysisCard({ analysisResult }: ContentAnalysisCardProps) {
  const { redFlags, warningFlags, safeIndicators } = analysisResult.contentAnalysis

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">Alta</Badge>
      case "medium":
        return <Badge className="bg-amber-500">Media</Badge>
      case "low":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
            Baja
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Análisis de contenido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {redFlags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 text-red-600 mb-2">
                <XCircle className="h-5 w-5" />
                Señales de alerta críticas
              </h3>
              <div className="space-y-3">
                {redFlags.map((flag, index) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-red-800">{flag.type}</div>
                      {getSeverityBadge(flag.severity)}
                    </div>
                    <p className="text-sm text-red-700 mt-1">{flag.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {warningFlags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 text-amber-600 mb-2">
                <AlertTriangle className="h-5 w-5" />
                Señales de advertencia
              </h3>
              <div className="space-y-3">
                {warningFlags.map((flag, index) => (
                  <div key={index} className="p-3 bg-amber-50 rounded-lg">
                    <div className="font-medium text-amber-800">{flag.type}</div>
                    <p className="text-sm text-amber-700 mt-1">{flag.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {safeIndicators.length > 0 && (
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle2 className="h-5 w-5" />
                Indicadores positivos
              </h3>
              <div className="space-y-3">
                {safeIndicators.map((indicator, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800">{indicator.type}</div>
                    <p className="text-sm text-green-700 mt-1">{indicator.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {redFlags.length === 0 && warningFlags.length === 0 && safeIndicators.length === 0 && (
            <p className="text-center text-gray-500">No se encontraron patrones significativos en el contenido.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
