import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, Mail, Server } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface EmailVerificationCardProps {
  emailVerification: {
    isValidFormat: boolean
    domainExists: boolean
    isDisposable: boolean
    mxRecords: string[]
    verificationStatus: "valid" | "suspicious" | "invalid" | "unknown"
    details: string
  }
  email: string
}

export default function EmailVerificationCard({ emailVerification, email }: EmailVerificationCardProps) {
  const { isValidFormat, domainExists, isDisposable, mxRecords, verificationStatus, details } = emailVerification

  const getStatusIcon = (status: boolean | string) => {
    if (status === true || status === "valid") {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />
    } else if (status === "suspicious") {
      return <AlertTriangle className="h-5 w-5 text-amber-600" />
    } else {
      return <XCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Válido
          </Badge>
        )
      case "suspicious":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Sospechoso
          </Badge>
        )
      case "invalid":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Inválido
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Desconocido
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Verificación de correo electrónico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Dirección analizada:</div>
            <div className="font-mono text-sm">{email}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-medium">Estado general:</div>
            <div className="flex items-center gap-2">
              {getStatusIcon(verificationStatus)}
              {getStatusBadge(verificationStatus)}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-sm">{details}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Resultados detallados:</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Formato válido</div>
                  <div>
                    {isValidFormat ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Dominio existe</div>
                  <div>
                    {domainExists ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Correo desechable</div>
                  <div>
                    {isDisposable ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Registros MX</div>
                  <div>
                    {mxRecords.length > 0 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {mxRecords.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                  <Server className="h-4 w-4" />
                  Servidores de correo encontrados:
                </div>
                <div className="p-3 rounded-lg bg-gray-50 max-h-24 overflow-y-auto">
                  <ul className="text-xs font-mono space-y-1">
                    {mxRecords.map((record, index) => (
                      <li key={index}>{record}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
