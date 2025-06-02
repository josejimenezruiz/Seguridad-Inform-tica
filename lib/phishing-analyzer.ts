// Simulación de un analizador de phishing
// En una aplicación real, esto sería un servicio más complejo con IA/ML

// Modificar la interfaz PhishingAnalysisResult para incluir la verificación de correo
interface PhishingAnalysisResult {
  riskScore: number
  verdict: string
  redFlags: number
  warningFlags: number
  senderAnalysis: {
    suspicious: boolean
    reason: string
    emailVerification?: {
      isValidFormat: boolean
      domainExists: boolean
      isDisposable: boolean
      mxRecords: string[]
      verificationStatus: "valid" | "suspicious" | "invalid" | "unknown"
      details: string
    }
  }
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
  links: {
    url: string
    displayText: string
    isSuspicious: boolean
    reason: string
    riskLevel: "high" | "medium" | "low" | "safe"
  }[]
}

interface EmailData {
  content: string
  subject?: string
  sender?: string
}

// Modificar la función analyzeEmail para incluir la verificación de correo
export async function analyzeEmail(emailData: EmailData): Promise<PhishingAnalysisResult> {
  // Simulamos un tiempo de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const { content, subject, sender } = emailData

  // Análisis del remitente
  const senderAnalysis = analyzeSender(sender || "")

  // Verificación de la dirección de correo si hay un remitente
  if (sender) {
    const emailVerification = await verifyEmailAddress(sender)
    senderAnalysis.emailVerification = emailVerification

    // Si el correo es inválido o sospechoso, marcamos el remitente como sospechoso
    if (emailVerification.verificationStatus === "invalid" || emailVerification.verificationStatus === "suspicious") {
      senderAnalysis.suspicious = true
      if (!senderAnalysis.reason.includes("dirección de correo")) {
        senderAnalysis.reason += senderAnalysis.reason ? ". Además, " : ""
        senderAnalysis.reason += emailVerification.details
      }
    }
  }

  // Análisis del contenido
  const contentAnalysisResult = analyzeContent(content, subject || "")

  // Extracción y análisis de enlaces
  const links = extractAndAnalyzeLinks(content)

  // Cálculo de puntuación de riesgo
  const redFlagsCount = contentAnalysisResult.redFlags.length + links.filter((l) => l.riskLevel === "high").length
  const warningFlagsCount =
    contentAnalysisResult.warningFlags.length +
    links.filter((l) => l.riskLevel === "medium" || l.riskLevel === "low").length

  // Calculamos la puntuación de riesgo (0-100)
  let riskScore = 0

  // Cada red flag suma entre 15-25 puntos dependiendo de la severidad
  contentAnalysisResult.redFlags.forEach((flag) => {
    if (flag.severity === "high") riskScore += 25
    else if (flag.severity === "medium") riskScore += 20
    else riskScore += 15
  })

  // Enlaces de alto riesgo suman 20 puntos cada uno
  riskScore += links.filter((l) => l.riskLevel === "high").length * 20

  // Enlaces de riesgo medio suman 10 puntos cada uno
  riskScore += links.filter((l) => l.riskLevel === "medium").length * 10

  // Enlaces de bajo riesgo suman 5 puntos cada uno
  riskScore += links.filter((l) => l.riskLevel === "low").length * 5

  // Advertencias suman 5-10 puntos
  riskScore += contentAnalysisResult.warningFlags.length * 7

  // Si el remitente es sospechoso, sumamos 15 puntos
  if (senderAnalysis.suspicious) riskScore += 15

  // Si la verificación de correo indica que es inválido, sumamos 20 puntos adicionales
  if (senderAnalysis.emailVerification?.verificationStatus === "invalid") {
    riskScore += 20
  } else if (senderAnalysis.emailVerification?.verificationStatus === "suspicious") {
    riskScore += 10
  }

  // Cada indicador seguro resta 5 puntos
  riskScore -= contentAnalysisResult.safeIndicators.length * 5

  // Aseguramos que el riesgo esté entre 0 y 100
  riskScore = Math.max(0, Math.min(100, riskScore))

  // Determinamos el veredicto
  let verdict = ""
  if (riskScore > 70) {
    verdict = "Alto riesgo de phishing"
  } else if (riskScore > 40) {
    verdict = "Posible intento de phishing"
  } else if (riskScore > 20) {
    verdict = "Bajo riesgo, pero mantén precaución"
  } else {
    verdict = "Correo probablemente legítimo"
  }

  return {
    riskScore,
    verdict,
    redFlags: redFlagsCount,
    warningFlags: warningFlagsCount,
    senderAnalysis,
    contentAnalysis: contentAnalysisResult,
    links,
  }
}

function analyzeSender(sender: string): { suspicious: boolean; reason: string } {
  // En una implementación real, esto sería mucho más sofisticado

  if (!sender) {
    return { suspicious: false, reason: "No se proporcionó información del remitente" }
  }

  // Verificar dominios sospechosos
  const suspiciousDomains = [
    "secure-bank",
    "account-verify",
    "login-secure",
    "verify-account",
    "security-alert",
    "customer-service",
  ]

  const senderLower = sender.toLowerCase()

  // Buscar dominios que intentan suplantar entidades conocidas
  for (const domain of suspiciousDomains) {
    if (senderLower.includes(domain)) {
      return {
        suspicious: true,
        reason: `El dominio contiene términos sospechosos (${domain})`,
      }
    }
  }

  // Verificar si el remitente intenta suplantar a una entidad conocida
  const commonEntities = ["paypal", "amazon", "apple", "microsoft", "google", "bank", "netflix"]
  for (const entity of commonEntities) {
    if (senderLower.includes(entity) && !senderLower.includes(`@${entity}.com`)) {
      return {
        suspicious: true,
        reason: `Posible suplantación de ${entity}`,
      }
    }
  }

  // Verificar dominios con números o caracteres extraños
  if (/[0-9]{3,}/.test(senderLower) || /[^a-zA-Z0-9@._-]/.test(senderLower)) {
    return {
      suspicious: true,
      reason: "El dominio contiene muchos números o caracteres inusuales",
    }
  }

  return { suspicious: false, reason: "No se detectaron problemas con el remitente" }
}

function analyzeContent(
  content: string,
  subject: string,
): {
  redFlags: { type: string; description: string; severity: "high" | "medium" | "low" }[]
  warningFlags: { type: string; description: string }[]
  safeIndicators: { type: string; description: string }[]
} {
  const redFlags: { type: string; description: string; severity: "high" | "medium" | "low" }[] = []
  const warningFlags: { type: string; description: string }[] = []
  const safeIndicators: { type: string; description: string }[] = []

  const contentLower = content.toLowerCase()
  const subjectLower = subject.toLowerCase()

  // Buscar patrones de urgencia (red flag)
  const urgencyPatterns = [
    "urgente",
    "inmediato",
    "ahora",
    "inmediatamente",
    "critical",
    "importante",
    "alerta",
    "suspendido",
    "suspensión",
    "bloqueado",
    "24 horas",
    "expirado",
    "expiración",
    "último aviso",
  ]

  for (const pattern of urgencyPatterns) {
    if (contentLower.includes(pattern) || subjectLower.includes(pattern)) {
      redFlags.push({
        type: "Sentido de urgencia",
        description: `El mensaje utiliza lenguaje que genera urgencia ("${pattern}")`,
        severity: "medium",
      })
      break
    }
  }

  // Buscar solicitudes de información sensible (red flag alto)
  const sensitiveRequestPatterns = [
    "contraseña",
    "password",
    "credenciales",
    "tarjeta de crédito",
    "número de cuenta",
    "pin",
    "seguridad social",
    "actualizar datos",
    "verificar cuenta",
    "confirmar identidad",
    "información bancaria",
  ]

  for (const pattern of sensitiveRequestPatterns) {
    if (contentLower.includes(pattern)) {
      redFlags.push({
        type: "Solicitud de información sensible",
        description: `El mensaje solicita información confidencial ("${pattern}")`,
        severity: "high",
      })
      break
    }
  }

  // Buscar ofertas demasiado buenas (red flag)
  const tooGoodPatterns = [
    "ganador",
    "premio",
    "lotería",
    "millones",
    "ganaste",
    "gratis",
    "oferta exclusiva",
    "descuento increíble",
    "limitado",
  ]

  for (const pattern of tooGoodPatterns) {
    if (contentLower.includes(pattern) || subjectLower.includes(pattern)) {
      redFlags.push({
        type: "Oferta demasiado buena",
        description: `El mensaje contiene ofertas o premios sospechosos ("${pattern}")`,
        severity: "medium",
      })
      break
    }
  }

  // Buscar amenazas o consecuencias negativas (red flag)
  const threatPatterns = [
    "suspender",
    "cerrar",
    "bloquear",
    "eliminar",
    "cancelar",
    "perderá",
    "acceso denegado",
    "violación",
    "penalización",
  ]

  for (const pattern of threatPatterns) {
    if (contentLower.includes(pattern)) {
      redFlags.push({
        type: "Amenazas o consecuencias",
        description: `El mensaje contiene amenazas o consecuencias negativas ("${pattern}")`,
        severity: "high",
      })
      break
    }
  }

  // Verificar errores gramaticales y ortográficos (warning)
  const grammarErrors = [
    "urgente responder",
    "querido cliente",
    "estimado usuario",
    "su cuenta ha sido",
    "hemos detectado actividad",
    "favor de",
    "favor confirmar",
    "click aqui",
    "pinche aqui",
  ]

  for (const error of grammarErrors) {
    if (contentLower.includes(error)) {
      warningFlags.push({
        type: "Errores gramaticales",
        description: `El mensaje contiene frases con posibles errores gramaticales o fórmulas sospechosas`,
      })
      break
    }
  }

  // Verificar saludos genéricos (warning)
  if (
    contentLower.includes("estimado cliente") ||
    contentLower.includes("estimado usuario") ||
    contentLower.includes("dear customer") ||
    contentLower.includes("dear user")
  ) {
    warningFlags.push({
      type: "Saludo genérico",
      description: "El mensaje utiliza un saludo genérico en lugar de dirigirse a ti por tu nombre",
    })
  }

  // Verificar si hay firma corporativa adecuada (safe indicator)
  if (content.includes("Atentamente,") && (content.includes("Departamento de") || content.includes("Equipo de"))) {
    safeIndicators.push({
      type: "Firma corporativa",
      description: "El mensaje incluye una firma corporativa formal",
    })
  }

  // Verificar si incluye información de contacto legítima (safe indicator)
  if (
    (content.includes("Si tienes dudas") || content.includes("Para más información")) &&
    (content.includes("atención al cliente") || content.includes("soporte"))
  ) {
    safeIndicators.push({
      type: "Información de contacto",
      description: "El mensaje incluye canales oficiales de atención al cliente",
    })
  }

  // Verificar si incluye aviso legal o disclaimer (safe indicator)
  if (content.includes("aviso legal") || content.includes("disclaimer") || content.includes("confidencialidad")) {
    safeIndicators.push({
      type: "Aviso legal",
      description: "El mensaje incluye un aviso legal o disclaimer",
    })
  }

  return {
    redFlags,
    warningFlags,
    safeIndicators,
  }
}

function extractAndAnalyzeLinks(content: string): {
  url: string
  displayText: string
  isSuspicious: boolean
  reason: string
  riskLevel: "high" | "medium" | "low" | "safe"
}[] {
  // En una implementación real, esto sería mucho más sofisticado
  // y utilizaría una base de datos de URLs maliciosas

  const links: {
    url: string
    displayText: string
    isSuspicious: boolean
    reason: string
    riskLevel: "high" | "medium" | "low" | "safe"
  }[] = []

  // Extraer enlaces HTML
  const htmlLinkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi
  let match

  while ((match = htmlLinkRegex.exec(content)) !== null) {
    const url = match[1]
    const displayText = match[2].replace(/<[^>]*>/g, "") // Eliminar HTML anidado

    links.push({
      url,
      displayText,
      ...analyzeLink(url, displayText),
    })
  }

  // Extraer URLs planas
  const urlRegex = /https?:\/\/[^\s<>"']+/gi
  let urlMatch

  while ((urlMatch = urlRegex.exec(content)) !== null) {
    const url = urlMatch[0]

    // Verificar si este URL ya fue extraído como enlace HTML
    if (!links.some((link) => link.url === url)) {
      links.push({
        url,
        displayText: "",
        ...analyzeLink(url, ""),
      })
    }
  }

  return links
}

function analyzeLink(
  url: string,
  displayText: string,
): {
  isSuspicious: boolean
  reason: string
  riskLevel: "high" | "medium" | "low" | "safe"
} {
  const urlLower = url.toLowerCase()

  // Verificar dominios de suplantación comunes
  const phishingDomains = [
    "secure-bank",
    "account-verify",
    "login-secure",
    "verify-account",
    "security-alert",
    "customer-service",
    "apple-id",
    "microsoft-verify",
    "paypal-secure",
    "netflix-update",
    "amazon-order",
    "google-security",
  ]

  for (const domain of phishingDomains) {
    if (urlLower.includes(domain)) {
      return {
        isSuspicious: true,
        reason: `El dominio contiene términos sospechosos (${domain})`,
        riskLevel: "high",
      }
    }
  }

  // Verificar URLs con IP en lugar de dominio
  if (/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(urlLower)) {
    return {
      isSuspicious: true,
      reason: "La URL utiliza una dirección IP en lugar de un nombre de dominio",
      riskLevel: "high",
    }
  }

  // Verificar dominios con muchos subdominios
  const subdomainCount = (urlLower.match(/\./g) || []).length
  if (subdomainCount > 3) {
    return {
      isSuspicious: true,
      reason: "La URL contiene un número inusual de subdominios",
      riskLevel: "medium",
    }
  }

  // Verificar discrepancia entre URL y texto mostrado
  if (displayText && !displayText.includes("...") && !urlLower.includes(displayText.toLowerCase())) {
    const commonEntities = ["paypal", "amazon", "apple", "microsoft", "google", "bank", "netflix"]

    for (const entity of commonEntities) {
      if (displayText.toLowerCase().includes(entity) && !urlLower.includes(entity)) {
        return {
          isSuspicious: true,
          reason: `El texto del enlace menciona ${entity} pero la URL no corresponde`,
          riskLevel: "high",
        }
      }
    }

    return {
      isSuspicious: true,
      reason: "El texto mostrado no coincide con la URL real",
      riskLevel: "medium",
    }
  }

  // Verificar URLs acortadas
  const shortenerServices = ["bit.ly", "tinyurl", "goo.gl", "t.co", "ow.ly", "is.gd", "buff.ly", "adf.ly", "tiny.cc"]
  for (const shortener of shortenerServices) {
    if (urlLower.includes(shortener)) {
      return {
        isSuspicious: true,
        reason: `La URL utiliza un servicio de acortamiento (${shortener})`,
        riskLevel: "medium",
      }
    }
  }

  // Verificar dominios con caracteres especiales o números
  if (/[0-9]{3,}/.test(urlLower) || /[^a-zA-Z0-9./?=&_-]/.test(urlLower)) {
    return {
      isSuspicious: true,
      reason: "La URL contiene muchos números o caracteres inusuales",
      riskLevel: "low",
    }
  }

  // Verificar dominios con extensiones poco comunes
  const commonTLDs = [".com", ".org", ".net", ".edu", ".gov", ".co", ".io", ".info", ".es", ".mx", ".ar", ".cl"]
  let hasTLD = false

  for (const tld of commonTLDs) {
    if (urlLower.includes(tld)) {
      hasTLD = true
      break
    }
  }

  if (!hasTLD) {
    return {
      isSuspicious: true,
      reason: "La URL utiliza una extensión de dominio poco común",
      riskLevel: "low",
    }
  }

  // Si no se detectaron problemas
  return {
    isSuspicious: false,
    reason: "No se detectaron problemas con este enlace",
    riskLevel: "safe",
  }
}

// Agregar la función para verificar direcciones de correo electrónico
async function verifyEmailAddress(email: string): Promise<{
  isValidFormat: boolean
  domainExists: boolean
  isDisposable: boolean
  mxRecords: string[]
  verificationStatus: "valid" | "suspicious" | "invalid" | "unknown"
  details: string
}> {
  // Verificar formato básico del correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValidFormat = emailRegex.test(email)

  if (!isValidFormat) {
    return {
      isValidFormat: false,
      domainExists: false,
      isDisposable: false,
      mxRecords: [],
      verificationStatus: "invalid",
      details: "La dirección de correo tiene un formato inválido",
    }
  }

  // Extraer el dominio
  const domain = email.split("@")[1]

  // Lista de dominios de correo desechables comunes
  const disposableDomains = [
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "throwawaymail.com",
    "yopmail.com",
    "getairmail.com",
    "getnada.com",
    "temp-mail.org",
    "fake-mail.net",
    "mailnesia.com",
    "tempinbox.com",
    "dispostable.com",
    "mailcatch.com",
    "anonbox.net",
    "sharklasers.com",
    "trashmail.com",
    "tempr.email",
    "discard.email",
    "maildrop.cc",
  ]

  const isDisposable = disposableDomains.some((d) => domain.includes(d))

  // En un entorno real, aquí haríamos una consulta DNS para verificar los registros MX
  // Pero como estamos en el navegador, simularemos esta verificación

  // Simulación de verificación de dominio y registros MX
  // En una implementación real, esto se haría en el servidor
  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "protonmail.com",
    "mail.com",
  ]
  const domainExists = commonDomains.includes(domain) || Math.random() > 0.3 // Simulación

  // Simulamos registros MX para dominios comunes
  let mxRecords: string[] = []
  if (domainExists) {
    if (domain === "gmail.com") {
      mxRecords = ["aspmx.l.google.com", "alt1.aspmx.l.google.com", "alt2.aspmx.l.google.com"]
    } else if (domain === "outlook.com" || domain === "hotmail.com") {
      mxRecords = ["outlook-com.olc.protection.outlook.com"]
    } else if (domain === "yahoo.com") {
      mxRecords = ["mta5.am0.yahoodns.net", "mta6.am0.yahoodns.net"]
    } else if (domain === "protonmail.com") {
      mxRecords = ["mail.protonmail.ch", "mailsec.protonmail.ch"]
    } else {
      // Para otros dominios, simulamos algunos registros genéricos
      mxRecords = [`mail.${domain}`, `smtp.${domain}`]
    }
  }

  // Determinamos el estado de verificación
  let verificationStatus: "valid" | "suspicious" | "invalid" | "unknown" = "unknown"
  let details = ""

  if (!isValidFormat) {
    verificationStatus = "invalid"
    details = "La dirección de correo tiene un formato inválido"
  } else if (isDisposable) {
    verificationStatus = "suspicious"
    details = "La dirección utiliza un dominio de correo temporal o desechable"
  } else if (!domainExists) {
    verificationStatus = "invalid"
    details = "El dominio de correo no existe o no tiene configuración de correo válida"
  } else if (mxRecords.length === 0) {
    verificationStatus = "suspicious"
    details = "El dominio existe pero no tiene registros MX configurados correctamente"
  } else {
    verificationStatus = "valid"
    details = "La dirección de correo tiene un formato válido y el dominio existe con configuración de correo"
  }

  // Simulamos un tiempo de procesamiento para la verificación
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    isValidFormat,
    domainExists,
    isDisposable,
    mxRecords,
    verificationStatus,
    details,
  }
}
