"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Shield, FileText, Upload, Mail, AlertCircle, CheckCircle2, Info } from "lucide-react"
import PhishingResultCard from "@/components/phishing-result-card"
import LinkAnalysisTable from "@/components/link-analysis-table"
import ContentAnalysisCard from "@/components/content-analysis-card"
import { analyzeEmail } from "@/lib/phishing-analyzer"
// Importar el nuevo componente EmailVerificationCard
import EmailVerificationCard from "@/components/email-verification-card"

export default function PhishingDetector() {
  const [emailContent, setEmailContent] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [sender, setSender] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("paste")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setEmailContent(content)

      // Try to extract subject from email file
      const subjectMatch = content.match(/Subject: (.*?)(?:\r?\n|\r)/i)
      if (subjectMatch && subjectMatch[1]) {
        setEmailSubject(subjectMatch[1])
      }

      // Try to extract sender from email file
      const fromMatch = content.match(/From: (.*?)(?:\r?\n|\r)/i)
      if (fromMatch && fromMatch[1]) {
        setSender(fromMatch[1])
      }
    }
    reader.readAsText(file)
  }

  const handleAnalyzeEmail = async () => {
    if (!emailContent) return

    setIsAnalyzing(true)

    try {
      // In a real application, this would be a server action or API call
      const result = await analyzeEmail({
        content: emailContent,
        subject: emailSubject,
        sender: sender,
      })

      setAnalysisResult(result)
    } catch (error) {
      console.error("Error analyzing email:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setEmailContent("")
    setEmailSubject("")
    setSender("")
    setAnalysisResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PhishGuard</h1>
            </div>
            <p className="text-sm text-gray-500">Detector de correos phishing</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!analysisResult ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Detector de Phishing por Email</h2>
              <p className="text-gray-600">
                Analiza el contenido de un correo electrónico para detectar posibles intentos de phishing
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Analizar correo electrónico</CardTitle>
                <CardDescription>Ingresa el contenido del correo electrónico que deseas analizar</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="paste" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Pegar contenido
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Subir archivo
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="paste" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Asunto del correo</Label>
                      <Input
                        id="subject"
                        placeholder="Ingresa el asunto del correo"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sender">Remitente</Label>
                      <Input
                        id="sender"
                        placeholder="Dirección de correo del remitente"
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Contenido del correo</Label>
                      <Textarea
                        id="content"
                        placeholder="Pega aquí el contenido completo del correo electrónico"
                        className="min-h-[200px]"
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="upload" className="mt-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                      <Mail className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Arrastra y suelta un archivo .eml o .txt, o haz clic para seleccionar
                      </p>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".eml,.txt,.msg"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                        Seleccionar archivo
                      </Button>
                      {emailContent && (
                        <div className="mt-4 text-sm text-green-600 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Archivo cargado correctamente
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetAnalysis}>
                  Limpiar
                </Button>
                <Button onClick={handleAnalyzeEmail} disabled={!emailContent || isAnalyzing}>
                  {isAnalyzing ? "Analizando..." : "Analizar correo"}
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-8">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Información importante</AlertTitle>
                <AlertDescription>
                  Esta herramienta analiza el contenido del correo para detectar posibles señales de phishing. No
                  almacenamos ningún dato de los correos analizados. Todo el procesamiento se realiza localmente en tu
                  navegador.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Resultado del análisis</h2>
              <Button variant="outline" onClick={resetAnalysis}>
                Analizar otro correo
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <PhishingResultCard result={analysisResult} />

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Detalles del correo analizado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emailSubject && (
                      <div>
                        <Label className="text-sm text-gray-500">Asunto</Label>
                        <p className="font-medium">{emailSubject}</p>
                      </div>
                    )}

                    {sender && (
                      <div>
                        <Label className="text-sm text-gray-500">Remitente</Label>
                        <p className="font-medium">{sender}</p>
                        {analysisResult.senderAnalysis.suspicious && (
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Remitente sospechoso
                            </Badge>
                            <span className="text-xs text-gray-500">{analysisResult.senderAnalysis.reason}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <Label className="text-sm text-gray-500">Contenido del correo</Label>
                      <ScrollArea className="h-[200px] mt-2 p-4 border rounded-md bg-gray-50">
                        <pre className="text-sm whitespace-pre-wrap">{emailContent}</pre>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <ContentAnalysisCard analysisResult={analysisResult} />

              <LinkAnalysisTable links={analysisResult.links} />

              {sender && analysisResult.senderAnalysis.emailVerification && (
                <EmailVerificationCard
                  emailVerification={analysisResult.senderAnalysis.emailVerification}
                  email={sender}
                />
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Recomendaciones de seguridad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.riskScore > 70 ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>¡Alto riesgo detectado!</AlertTitle>
                        <AlertDescription>
                          Este correo muestra múltiples señales de ser un intento de phishing. Recomendamos no
                          interactuar con él, no hacer clic en ningún enlace y no descargar archivos adjuntos.
                        </AlertDescription>
                      </Alert>
                    ) : analysisResult.riskScore > 40 ? (
                      <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Precaución recomendada</AlertTitle>
                        <AlertDescription>
                          Este correo muestra algunas señales sospechosas. Verifique la identidad del remitente por otro
                          canal antes de hacer clic en enlaces o descargar archivos.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="default" className="border-green-200 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Bajo riesgo detectado</AlertTitle>
                        <AlertDescription className="text-green-700">
                          Este correo no muestra señales claras de phishing, pero siempre es recomendable mantener
                          precaución al interactuar con correos electrónicos.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Consejos generales:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Verifique siempre la dirección de correo del remitente</li>
                        <li>Desconfíe de correos que solicitan información personal o financiera</li>
                        <li>Pase el cursor sobre los enlaces antes de hacer clic para ver la URL real</li>
                        <li>Tenga cuidado con correos que generan sensación de urgencia</li>
                        <li>Verifique errores gramaticales y ortográficos, comunes en correos fraudulentos</li>
                        <li>Si tiene dudas, contacte directamente con la empresa o persona por canales oficiales</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-600">PhishGuard - Detector de correos phishing</p>
            </div>
            <p className="text-xs text-gray-500">
              Esta herramienta es solo para fines educativos. No reemplaza el juicio humano ni garantiza la detección de
              todos los intentos de phishing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
