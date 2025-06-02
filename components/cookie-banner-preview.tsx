"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Monitor, Smartphone, Tablet } from "lucide-react"
import { useState } from "react"

interface CookieConfig {
  companyName: string
  website: string
  email: string
  country: string
  language: string
  cookieTypes: {
    necessary: boolean
    functional: boolean
    analytics: boolean
    marketing: boolean
  }
  bannerStyle: string
  bannerPosition: string
  primaryColor: string
  textColor: string
  customMessage: string
}

interface CookieBannerPreviewProps {
  config: CookieConfig
}

export default function CookieBannerPreview({ config }: CookieBannerPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [bannerVisible, setBannerVisible] = useState(true)

  const getDeviceClass = () => {
    switch (device) {
      case "mobile":
        return "max-w-sm"
      case "tablet":
        return "max-w-2xl"
      default:
        return "max-w-6xl"
    }
  }

  const getDeviceIcon = () => {
    switch (device) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const message =
    config.customMessage ||
    "Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Al continuar navegando, acepta nuestro uso de cookies."

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vista Previa del Banner
          </CardTitle>
          <CardDescription>Vea cómo se verá el banner de cookies en diferentes dispositivos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={device === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setDevice("desktop")}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                Escritorio
              </Button>
              <Button
                variant={device === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => setDevice("tablet")}
                className="flex items-center gap-2"
              >
                <Tablet className="h-4 w-4" />
                Tablet
              </Button>
              <Button
                variant={device === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setDevice("mobile")}
                className="flex items-center gap-2"
              >
                <Smartphone className="h-4 w-4" />
                Móvil
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <div className={`mx-auto transition-all duration-300 ${getDeviceClass()}`}>
                <div className="bg-white min-h-96 relative border-x">
                  {/* Contenido simulado de la página */}
                  <div className="p-8 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-gray-200 rounded"></div>
                      <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>

                  {/* Banner de cookies */}
                  {bannerVisible && (
                    <div
                      className={`absolute left-0 right-0 z-10 shadow-lg ${
                        config.bannerPosition === "top" ? "top-0" : "bottom-0"
                      }`}
                      style={{
                        backgroundColor: config.primaryColor,
                        color: config.textColor,
                      }}
                    >
                      <div className="p-4">
                        <div
                          className={`flex items-center justify-between gap-4 ${
                            device === "mobile" ? "flex-col space-y-3" : ""
                          }`}
                        >
                          <div className="flex-1">
                            <p className="text-sm">
                              {message}
                              <a href="#" className="underline ml-1" style={{ color: config.textColor }}>
                                Más información
                              </a>
                            </p>
                          </div>
                          <div className={`flex gap-2 ${device === "mobile" ? "w-full" : ""}`}>
                            <Button
                              size="sm"
                              onClick={() => setBannerVisible(false)}
                              style={{
                                backgroundColor: "rgba(255,255,255,0.2)",
                                color: config.textColor,
                                border: "1px solid rgba(255,255,255,0.3)",
                              }}
                              className={device === "mobile" ? "flex-1" : ""}
                            >
                              Aceptar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setBannerVisible(false)}
                              style={{
                                backgroundColor: "transparent",
                                color: config.textColor,
                                border: "1px solid rgba(255,255,255,0.3)",
                              }}
                              className={device === "mobile" ? "flex-1" : ""}
                            >
                              Rechazar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!bannerVisible && (
              <div className="text-center">
                <Button onClick={() => setBannerVisible(true)} variant="outline">
                  Mostrar Banner Nuevamente
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Configuración Actual</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Estilo:</span>
                  <Badge variant="secondary">{config.bannerStyle}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Posición:</span>
                  <Badge variant="secondary">{config.bannerPosition}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Color principal:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border" style={{ backgroundColor: config.primaryColor }}></div>
                    <span className="font-mono text-xs">{config.primaryColor}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tipos de Cookies Activas</h4>
              <div className="space-y-1">
                {config.cookieTypes.necessary && <Badge variant="default">Necesarias</Badge>}
                {config.cookieTypes.functional && <Badge variant="secondary">Funcionales</Badge>}
                {config.cookieTypes.analytics && <Badge variant="secondary">Analíticas</Badge>}
                {config.cookieTypes.marketing && <Badge variant="secondary">Marketing</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
