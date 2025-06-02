import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ShieldAlert, ShieldCheck } from "lucide-react"

interface PhishingResultCardProps {
  result: {
    riskScore: number
    verdict: string
    redFlags: number
    warningFlags: number
  }
}

export default function PhishingResultCard({ result }: PhishingResultCardProps) {
  const { riskScore, verdict, redFlags, warningFlags } = result

  const getRiskColor = (score: number) => {
    if (score > 70) return "text-red-600"
    if (score > 40) return "text-amber-600"
    return "text-green-600"
  }

  const getRiskBgColor = (score: number) => {
    if (score > 70) return "bg-red-100"
    if (score > 40) return "bg-amber-100"
    return "bg-green-100"
  }

  const getRiskProgressColor = (score: number) => {
    if (score > 70) return "bg-red-600"
    if (score > 40) return "bg-amber-500"
    return "bg-green-600"
  }

  const getRiskIcon = (score: number) => {
    if (score > 40) {
      return <ShieldAlert className={`h-12 w-12 ${score > 70 ? "text-red-600" : "text-amber-600"}`} />
    }
    return <ShieldCheck className="h-12 w-12 text-green-600" />
  }

  return (
    <Card>
      <CardHeader className={`${getRiskBgColor(riskScore)} rounded-t-lg`}>
        <CardTitle className="text-center">Nivel de riesgo</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center">
          {getRiskIcon(riskScore)}

          <div className="mt-4 text-center">
            <div className={`text-4xl font-bold ${getRiskColor(riskScore)}`}>{riskScore}%</div>
            <p className="text-sm text-gray-500 mt-1">Puntuación de riesgo</p>
          </div>

          <div className="w-full mt-4">
            <Progress value={riskScore} className="h-3" indicatorClassName={getRiskProgressColor(riskScore)} />
          </div>

          <div className="mt-6 text-center">
            <p className={`font-medium ${getRiskColor(riskScore)}`}>{verdict}</p>
          </div>

          <div className="mt-6 w-full grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">{redFlags}</div>
              <div className="text-xs text-red-700">Alertas críticas</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <div className="text-xl font-bold text-amber-600">{warningFlags}</div>
              <div className="text-xs text-amber-700">Advertencias</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
