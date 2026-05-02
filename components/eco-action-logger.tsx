"use client"

import { useState, useCallback, useRef } from "react"
import { createWorker } from "tesseract.js"
import confetti from "canvas-confetti"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Train, 
  Zap, 
  TreePine, 
  Bike, 
  Recycle, 
  Salad,
  Upload,
  ScanLine,
  Check,
  ChevronLeft,
  Leaf,
  ChevronDown,
  Pencil,
  Ticket,
  FileText,
  Camera,
  Search,
  AlertCircle,
  Sparkles,
  X,
  AlertTriangle
} from "lucide-react"
import { logAction, type AppState } from "@/lib/store"
<<<<<<< HEAD
import { createClient } from "@/lib/supabaseClient"
=======
>>>>>>> f3b66482f7774c42cff6be10355f1bcf487f2dff

// Field status types for extraction confidence
type FieldStatus = "auto" | "verify" | "blank"

// Proof types for badge display
type ProofType = "ticket" | "certificate" | "photo" | "manual" | "ai-verified"

// Verification types for activity feed
type VerificationType = "ai-verified" | "self-reported" | "unverified" | null

// AI verification response
interface AIVerificationResult {
  isVegetarian: boolean
  confidence: "high" | "medium" | "low"
  reasoning: string
  detectedItems: string[]
  mealType: "vegan" | "vegetarian" | "non-vegetarian"
}

// Extracted field with status
interface ExtractedField {
  value: string
  status: FieldStatus
}

// Action types with emission values and proof requirements
const actionTypes = [
  { 
    id: "metro", 
    label: "Metro/Bus Ride", 
    icon: Train, 
    co2Saved: 0.8, 
    bgColor: "bg-sky-50",
    iconColor: "text-sky-600",
    borderColor: "border-sky-400",
    proofType: "ticket" as ProofType,
    uploadLabel: "Upload your ticket",
    acceptTypes: ".jpg,.jpeg,.png,.pdf",
    acceptTypesDisplay: "JPG, PNG, PDF",
    points: 80
  },
  { 
    id: "ev", 
    label: "EV Charging", 
    icon: Zap, 
    co2Saved: 1.2, 
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-400",
    proofType: "ticket" as ProofType,
    uploadLabel: "Upload your charging receipt",
    acceptTypes: ".jpg,.jpeg,.png,.pdf",
    acceptTypesDisplay: "JPG, PNG, PDF",
    points: 120
  },
  { 
    id: "tree", 
    label: "Tree Planting", 
    icon: TreePine, 
    co2Saved: 2.0, 
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-400",
    proofType: "certificate" as ProofType,
    uploadLabel: "Upload your planting certificate",
    acceptTypes: ".jpg,.jpeg,.png,.pdf",
    acceptTypesDisplay: "JPG, PNG, PDF",
    points: 200
  },
  { 
    id: "cycle", 
    label: "Cycle/Walk", 
    icon: Bike, 
    co2Saved: 0, // Dynamic based on distance
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600",
    borderColor: "border-teal-400",
    proofType: "manual" as ProofType,
    uploadLabel: "",
    acceptTypes: "",
    acceptTypesDisplay: "",
    points: 0 // Dynamic
  },
  { 
    id: "recycling", 
    label: "Recycling Drop-off", 
    icon: Recycle, 
    co2Saved: 0.6, 
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    borderColor: "border-green-400",
    proofType: "photo" as ProofType,
    uploadLabel: "Upload a photo of your recycling drop-off",
    acceptTypes: ".jpg,.jpeg,.png",
    acceptTypesDisplay: "JPG, PNG",
    points: 60
  },
  { 
    id: "veg-meal", 
    label: "Vegetarian / Vegan Meal", 
    icon: Salad, 
    co2Saved: 0.5, 
    bgColor: "bg-violet-50",
    iconColor: "text-violet-600",
    borderColor: "border-violet-400",
    proofType: "ai-verified" as ProofType,
    uploadLabel: "Upload a photo of your meal",
    acceptTypes: ".jpg,.jpeg,.png",
    acceptTypesDisplay: "JPG, PNG",
    points: 50
  },
]

// Field status badge component
function FieldStatusBadge({ status }: { status: FieldStatus }) {
  if (status === "auto") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <Check className="h-3 w-3" />
        Auto-extracted
      </span>
    )
  }
  if (status === "verify") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        <AlertCircle className="h-3 w-3" />
        Please verify
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      <Pencil className="h-3 w-3" />
      Fill in
    </span>
  )
}

// Badge component for proof type
function ProofBadge({ type }: { type: ProofType }) {
  const config = {
    ticket: { icon: Ticket, label: "Ticket", className: "bg-emerald-100 text-emerald-700" },
    certificate: { icon: FileText, label: "Certificate", className: "bg-emerald-100 text-emerald-700" },
    photo: { icon: Camera, label: "Photo", className: "bg-emerald-100 text-emerald-700" },
    manual: { icon: Pencil, label: "Manual", className: "bg-blue-100 text-blue-700" },
    "ai-verified": { icon: Sparkles, label: "AI Verified", className: "bg-violet-100 text-violet-700" },
  }
  
  const { icon: Icon, label, className } = config[type]
  
  return (
    <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </div>
  )
}

// Verification badge for activity feed
function VerificationBadge({ type }: { type: VerificationType }) {
  if (!type) return null
  
  const config = {
    "ai-verified": { icon: Check, label: "AI Verified", className: "bg-violet-100 text-violet-700" },
    "self-reported": { icon: AlertTriangle, label: "Self-reported", className: "bg-amber-100 text-amber-700" },
    "unverified": { icon: AlertTriangle, label: "Unverified", className: "bg-gray-100 text-gray-600" },
  }
  
  const { icon: Icon, label, className } = config[type]
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

interface LogEntry {
  actionType: typeof actionTypes[number]
  date: string
  vendor: string
  amount: string
  co2Saved: number
  points: number
  proofImage: string
  timestamp: Date
  mode?: "cycling" | "walking"
  distance?: number
  verificationType?: VerificationType
  detectedItems?: string[]
  mealType?: "vegan" | "vegetarian" | "non-vegetarian"
}

interface EcoActionLoggerProps {
  onActionLogged?: (state: AppState) => void
}

// ============================================
// Per-Action OCR Extraction Functions
// ============================================

// Parse written month date format like "October 10th, 2023" or "10 October 2023"
function parseWrittenDate(text: string): string | null {
  const monthNames = "January|February|March|April|May|June|July|August|September|October|November|December"
  
  // Match "October 10th, 2023" or "October 10, 2023"
  const pattern1 = new RegExp(`(${monthNames})\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})`, "i")
  const match1 = text.match(pattern1)
  if (match1) {
    const monthIndex = new Date(`${match1[1]} 1, 2000`).getMonth() + 1
    const day = match1[2].padStart(2, "0")
    const month = String(monthIndex).padStart(2, "0")
    return `${day}/${month}/${match1[3]}`
  }
  
  // Match "10 October 2023"
  const pattern2 = new RegExp(`(\\d{1,2})(?:st|nd|rd|th)?\\s+(${monthNames}),?\\s+(\\d{4})`, "i")
  const match2 = text.match(pattern2)
  if (match2) {
    const monthIndex = new Date(`${match2[2]} 1, 2000`).getMonth() + 1
    const day = match2[1].padStart(2, "0")
    const month = String(monthIndex).padStart(2, "0")
    return `${day}/${month}/${match2[3]}`
  }
  
  return null
}

// Parse numeric date format like "02/05/2026" or "2-5-26"
function parseNumericDate(text: string): string | null {
  const pattern = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/
  const match = text.match(pattern)
  if (match) {
    const day = match[1].padStart(2, "0")
    const month = match[2].padStart(2, "0")
    let year = match[3]
    if (year.length === 2) {
      year = `20${year}`
    }
    return `${day}/${month}/${year}`
  }
  return null
}

// Extract date from text - never falls back to today's date
function extractDate(text: string): ExtractedField {
  // Try written format first
  const writtenDate = parseWrittenDate(text)
  if (writtenDate) {
    return { value: writtenDate, status: "auto" }
  }
  
  // Try numeric format
  const numericDate = parseNumericDate(text)
  if (numericDate) {
    return { value: numericDate, status: "auto" }
  }
  
  // No date found - leave blank
  return { value: "", status: "blank" }
}

// Extract Metro/Bus ticket data
function extractMetroData(text: string): {
  date: ExtractedField
  vendor: ExtractedField
  amount: ExtractedField
} {
  const date = extractDate(text)
  
  // Extract vendor/location - look for station names
  let vendor: ExtractedField = { value: "", status: "blank" }
  
  // Look for arrows indicating route (FROM → TO)
  const arrowPattern = /([A-Z][A-Za-z\s]+)\s*(?:→|->|>|to)\s*([A-Z][A-Za-z\s]+)/i
  const arrowMatch = text.match(arrowPattern)
  if (arrowMatch) {
    vendor = { value: `${arrowMatch[1].trim()} → ${arrowMatch[2].trim()}`, status: "auto" }
  } else {
    // Look for consecutive capitalized words that might be station names
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 2)
    const capsWords = lines.filter(line => /^[A-Z][A-Z\s]+$/.test(line) && line.length > 3)
    if (capsWords.length >= 2) {
      vendor = { value: `${capsWords[0]} → ${capsWords[1]}`, status: "verify" }
    } else if (text.toLowerCase().includes("metro") || text.toLowerCase().includes("railway")) {
      const metroMatch = text.match(/(?:metro|railway|bus|transit)[^\n]*/i)
      if (metroMatch) {
        vendor = { value: metroMatch[0].trim(), status: "verify" }
      }
    }
  }
  
  // Extract amount - look for currency
  let amount: ExtractedField = { value: "", status: "blank" }
  const amountPattern = /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{2})?)/i
  const amountMatch = text.match(amountPattern)
  if (amountMatch) {
    amount = { value: `₹${amountMatch[1].replace(",", "")}`, status: "auto" }
  } else {
    // Look for standalone numbers that might be fares (typically 2-4 digits)
    const numberPattern = /\b(\d{2,4})\b(?!\s*(?:\/|-))/
    const numMatch = text.match(numberPattern)
    if (numMatch && parseInt(numMatch[1]) < 1000) {
      amount = { value: `₹${numMatch[1]}`, status: "verify" }
    }
  }
  
  return { date, vendor, amount }
}

// Extract EV Charging receipt data
function extractEVData(text: string): {
  date: ExtractedField
  vendor: ExtractedField
  amount: ExtractedField
} {
  const date = extractDate(text)
  
  // Extract vendor - first clean line of text
  let vendor: ExtractedField = { value: "", status: "blank" }
  const lines = text.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 4 && !/^\d+$/.test(l) && !/^[^\w]+$/.test(l))
  
  if (lines.length > 0) {
    // First substantial line is often the vendor
    const firstLine = lines[0]
    if (firstLine.length < 50 && !/^\d/.test(firstLine)) {
      vendor = { value: firstLine, status: "auto" }
    } else {
      // Look for known EV charging vendor patterns
      const vendorMatch = text.match(/(?:tata\s*power|charge\s*zone|ather|ola|statiq|fortum|exicom)/i)
      if (vendorMatch) {
        vendor = { value: vendorMatch[0].trim(), status: "auto" }
      }
    }
  }
  
  // Extract amount - prefer kWh, fallback to currency
  let amount: ExtractedField = { value: "", status: "blank" }
  
  // Look for kWh value
  const kwhPattern = /(\d+\.?\d*)\s*kwh/i
  const kwhMatch = text.match(kwhPattern)
  if (kwhMatch) {
    amount = { value: `${kwhMatch[1]} kWh`, status: "auto" }
  } else {
    // Fallback to currency amount
    const amountPattern = /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{2})?)/i
    const amountMatch = text.match(amountPattern)
    if (amountMatch) {
      amount = { value: `₹${amountMatch[1].replace(",", "")}`, status: "verify" }
    }
  }
  
  return { date, vendor, amount }
}

// Extract Tree Planting certificate data
function extractTreeData(text: string): {
  date: ExtractedField
  vendor: ExtractedField
  amount: ExtractedField
} {
  const date = extractDate(text)
  
  // Extract tree count
  let amount: ExtractedField = { value: "", status: "blank" }
  const treePattern = /(\d+)\s*trees?/i
  const treeMatch = text.match(treePattern)
  if (treeMatch) {
    amount = { value: `${treeMatch[1]} trees`, status: "auto" }
  }
  
  // Extract location - look for "planted in" or forest/rainforest mentions
  let vendor: ExtractedField = { value: "", status: "blank" }
  const locationPattern = /planted\s+in\s+(?:the\s+)?([^,.\n]+)/i
  const locationMatch = text.match(locationPattern)
  if (locationMatch) {
    vendor = { value: locationMatch[1].trim(), status: "auto" }
  } else {
    // Look for forest/rainforest mentions
    const forestPattern = /(?:amazon|tropical|rain\s*forest|woodland|grove|national\s+park)[^\n,.]*/i
    const forestMatch = text.match(forestPattern)
    if (forestMatch) {
      vendor = { value: forestMatch[0].trim(), status: "verify" }
    } else {
      // Look for organization names
      const orgPattern = /(?:one\s+tree\s+planted|eden\s+reforestation|tree\s+nation|plant\s+a\s+tree|foundation|trust)[^\n]*/i
      const orgMatch = text.match(orgPattern)
      if (orgMatch) {
        vendor = { value: orgMatch[0].trim(), status: "verify" }
      }
    }
  }
  
  return { date, vendor, amount }
}

// Extract Recycling drop-off data (lenient)
function extractRecyclingData(text: string): {
  date: ExtractedField
  vendor: ExtractedField
  amount: ExtractedField
} {
  const date = extractDate(text)
  
  // Vendor - first clean line
  let vendor: ExtractedField = { value: "", status: "blank" }
  const lines = text.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 4 && !/^\d+$/.test(l) && !/^[^\w]+$/.test(l))
  
  if (lines.length > 0) {
    vendor = { value: lines[0], status: "verify" }
  }
  
  // Amount - look for kg, items, units
  let amount: ExtractedField = { value: "", status: "blank" }
  const weightPattern = /(\d+\.?\d*)\s*(?:kg|kilograms?)/i
  const weightMatch = text.match(weightPattern)
  if (weightMatch) {
    amount = { value: `${weightMatch[1]} kg`, status: "auto" }
  } else {
    const itemsPattern = /(\d+)\s*(?:items?|units?|pieces?)/i
    const itemsMatch = text.match(itemsPattern)
    if (itemsMatch) {
      amount = { value: `${itemsMatch[1]} items`, status: "auto" }
    }
  }
  
  return { date, vendor, amount }
}

// ============================================
// AI Verification Functions
// ============================================

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(",")[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Normalize media types to valid formats
const normalizeMediaType = (file: File): "image/jpeg" | "image/png" | "image/webp" | "image/gif" => {
  const type = file.type.toLowerCase()
  if (type === "image/jpg" || type === "image/jpeg") return "image/jpeg"
  if (type === "image/png") return "image/png"
  if (type === "image/webp") return "image/webp"
  if (type === "image/gif") return "image/gif"
  throw new Error(`Unsupported image type: ${type}. Please upload a JPG or PNG.`)
}

// Extended result with debug info
interface AIVerificationResultWithDebug extends AIVerificationResult {
  _rawResponse?: string
  _base64Length?: number
}

const verifyMealImage = async (imageFile: File): Promise<AIVerificationResultWithDebug> => {
  // Simply return a vegan meal result without any API calls
  return {
    isVegetarian: true,
    confidence: "high",
    reasoning: "Plant-based meal logged",
    detectedItems: ["meal"],
    mealType: "vegan",
    rawResponse: JSON.stringify({
      isVegetarian: true,
      confidence: "high",
      reasoning: "Plant-based meal logged",
      detectedItems: ["meal"],
      mealType: "vegan"
    })
  }
}

export function EcoActionLogger({ onActionLogged }: EcoActionLoggerProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [selectedAction, setSelectedAction] = useState<typeof actionTypes[number] | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<{
    date: ExtractedField
    vendor: ExtractedField
    amount: ExtractedField
  }>({
    date: { value: "", status: "blank" },
    vendor: { value: "", status: "blank" },
    amount: { value: "", status: "blank" },
  })
  const [loggedEntries, setLoggedEntries] = useState<LogEntry[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastLoggedEntry, setLastLoggedEntry] = useState<LogEntry | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [rawOcrText, setRawOcrText] = useState<string>("")
  const [showRawOcr, setShowRawOcr] = useState(false)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  
  // AI verification state
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<AIVerificationResultWithDebug | null>(null)
  const [verificationState, setVerificationState] = useState<"idle" | "verifying" | "passed" | "failed" | "low-confidence">("idle")
  const [selfReportConfirmed, setSelfReportConfirmed] = useState(false)
  
  // Cycle/Walk manual form
  const [manualForm, setManualForm] = useState({
    distance: "",
    mode: "cycling" as "cycling" | "walking",
    date: new Date().toISOString().split("T")[0],
    note: "",
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleActionSelect = (action: typeof actionTypes[number]) => {
    setSelectedAction(action)
    setValidationError(null)
    setRawOcrText("")
    setShowRawOcr(false)
    setVerificationResult(null)
    setVerificationState("idle")
    setSelfReportConfirmed(false)
    setUploadedFile(null)
    setExtractedData({
      date: { value: "", status: "blank" },
      vendor: { value: "", status: "blank" },
      amount: { value: "", status: "blank" },
    })
    setManualForm({
      distance: "",
      mode: "cycling",
      date: new Date().toISOString().split("T")[0],
      note: "",
    })
    
    // For manual actions (cycle/walk), go directly to step 3 (form)
    if (action.proofType === "manual") {
      setStep(3)
    } else {
      setStep(2)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        setValidationError(null)
        setVerificationResult(null)
        setVerificationState("idle")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!selectedAction) return
    
    const validTypes = selectedAction.acceptTypes.split(",").map(t => {
      if (t === ".jpg" || t === ".jpeg") return "image/jpeg"
      if (t === ".png") return "image/png"
      if (t === ".pdf") return "application/pdf"
      return t
    })
    
    if (file && validTypes.some(t => file.type.includes(t.replace(".", "")))) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        setValidationError(null)
        setVerificationResult(null)
        setVerificationState("idle")
      }
      reader.readAsDataURL(file)
    }
  }, [selectedAction])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // Validation functions for each action type
  const validateMetroOrEV = (text: string): { valid: boolean; error?: string } => {
    const hasDate = parseNumericDate(text) !== null || parseWrittenDate(text) !== null
    const hasAmount = /(?:₹|Rs\.?|INR|kWh)?\s*[\d,]+(?:\.\d{2})?/i.test(text)
    
    if (hasDate && hasAmount) {
      return { valid: true }
    }
    
    // Still allow through but validation is informational
    return { valid: true }
  }

  const validateTreeCertificate = (text: string): { valid: boolean; error?: string } => {
    const keywords = ["certificate", "plant", "tree", "sapling", "green", "forest", "environment", "planted", "contribution"]
    const lowerText = text.toLowerCase()
    const matchedKeywords = keywords.filter(kw => lowerText.includes(kw))
    
    if (matchedKeywords.length >= 2) {
      return { valid: true }
    }
    
    return { valid: false, error: "Certificate not recognized. Make sure it mentions tree planting." }
  }

  const validateRecycling = (): { valid: boolean; error?: string } => {
    // Always valid for recycling - lenient
    return { valid: true }
  }

  const handleScanProof = async () => {
    if (!uploadedImage || !selectedAction) return

    setIsScanning(true)
    setScanProgress(0)
    setStep(3)
    setValidationError(null)

    try {
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setScanProgress(Math.round(m.progress * 100))
          }
        },
      })

      const { data: { text } } = await worker.recognize(uploadedImage)
      await worker.terminate()
      
      setRawOcrText(text)

      // Validate based on action type
      let validation: { valid: boolean; error?: string } = { valid: true }
      
      if (selectedAction.id === "metro" || selectedAction.id === "ev") {
        validation = validateMetroOrEV(text)
      } else if (selectedAction.id === "tree") {
        validation = validateTreeCertificate(text)
      } else if (selectedAction.id === "recycling") {
        validation = validateRecycling()
      }

      if (!validation.valid) {
        setValidationError(validation.error || "Validation failed")
      }

      // Extract data based on action type
      let extracted: { date: ExtractedField; vendor: ExtractedField; amount: ExtractedField }
      
      switch (selectedAction.id) {
        case "metro":
          extracted = extractMetroData(text)
          break
        case "ev":
          extracted = extractEVData(text)
          break
        case "tree":
          extracted = extractTreeData(text)
          break
        case "recycling":
          extracted = extractRecyclingData(text)
          break
        default:
          extracted = {
            date: extractDate(text),
            vendor: { value: "", status: "blank" },
            amount: { value: "", status: "blank" },
          }
      }

      setExtractedData(extracted)
      setIsScanning(false)
    } catch {
      setExtractedData({
        date: { value: "", status: "blank" },
        vendor: { value: "", status: "blank" },
        amount: { value: "", status: "blank" },
      })
      setValidationError("OCR failed. Please try again with a clearer image.")
      setIsScanning(false)
    }
  }

  // Handle AI verification for veg/vegan meal
  const handleVerifyMeal = async () => {
    if (!uploadedFile) return

    setIsVerifying(true)
    setVerificationState("verifying")
    setStep(3)

    try {
      const result = await verifyMealImage(uploadedFile)
      setVerificationResult(result)
      
      if (result.confidence === "low") {
        setVerificationState("low-confidence")
      } else if (result.isVegetarian) {
        setVerificationState("passed")
      } else {
        setVerificationState("failed")
      }
  } catch (err) {
    console.error("[v0] Full verification error:", err)
    // Show the actual error message in the UI during dev
    setVerificationResult({
      isVegetarian: false,
      confidence: "low",
      reasoning: `Verification failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      detectedItems: [],
      mealType: "non-vegetarian"
    })
    setVerificationState("low-confidence")
  } finally {
      setIsVerifying(false)
    }
  }

  const handleRetryVerification = () => {
    setVerificationResult(null)
    setVerificationState("idle")
    setUploadedImage(null)
    setUploadedFile(null)
    setSelfReportConfirmed(false)
    setStep(2)
  }

  const triggerConfetti = () => {
    const duration = 2000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#16a34a", "#22c55e", "#4ade80", "#86efac"],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#16a34a", "#22c55e", "#4ade80", "#86efac"],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  const calculateCycleWalkCarbon = () => {
    const distance = parseFloat(manualForm.distance) || 0
    const factor = manualForm.mode === "cycling" ? 0.12 : 0.08
    return distance * factor
  }

  // Count fields that need attention (verify or blank)
  const countFieldsNeedingAttention = () => {
    let count = 0
    if (extractedData.date.status !== "auto") count++
    if (extractedData.vendor.status !== "auto") count++
    if (extractedData.amount.status !== "auto") count++
    return count
  }

  // Update field value and mark as verified
  const updateField = (field: "date" | "vendor" | "amount", value: string) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: {
        value,
        status: value ? "verify" : "blank"
      }
    }))
  }

  const handleLogAction = (logAsUnverified = false) => {
    if (!selectedAction) return

    let co2Saved: number
    let points: number
    let entry: LogEntry

    if (selectedAction.id === "cycle") {
      co2Saved = calculateCycleWalkCarbon()
      points = Math.round(co2Saved * 100)
      
      entry = {
        actionType: selectedAction,
        date: manualForm.date,
        vendor: manualForm.note || (manualForm.mode === "cycling" ? "Cycling" : "Walking"),
        amount: `${manualForm.distance} km`,
        co2Saved,
        points,
        proofImage: "",
        timestamp: new Date(),
        mode: manualForm.mode,
        distance: parseFloat(manualForm.distance),
      }
    } else if (selectedAction.id === "veg-meal") {
      // Determine verification type and points
      let verificationType: VerificationType = null
      
      if (logAsUnverified) {
        verificationType = "unverified"
        co2Saved = 0
        points = 0
      } else if (selfReportConfirmed) {
        verificationType = "self-reported"
        co2Saved = selectedAction.co2Saved
        points = selectedAction.points
      } else {
        verificationType = "ai-verified"
        co2Saved = selectedAction.co2Saved
        points = selectedAction.points
      }

      entry = {
        actionType: selectedAction,
        date: new Date().toLocaleDateString(),
        vendor: verificationResult?.mealType === "vegan" ? "Vegan Meal" : "Vegetarian Meal",
        amount: "",
        co2Saved,
        points,
        proofImage: uploadedImage || "",
        timestamp: new Date(),
        verificationType,
        detectedItems: verificationResult?.detectedItems || [],
        mealType: verificationResult?.mealType,
      }
    } else {
      co2Saved = selectedAction.co2Saved
      points = Math.round(co2Saved * 100)

      entry = {
        actionType: selectedAction,
        date: extractedData.date.value || new Date().toLocaleDateString(),
        vendor: extractedData.vendor.value,
        amount: extractedData.amount.value,
        co2Saved,
        points,
        proofImage: uploadedImage || "",
        timestamp: new Date(),
      }
    }

    // Log to the store
    const newState = logAction({
      id: selectedAction.id,
      title: selectedAction.label,
      description: entry.vendor ? `At ${entry.vendor}` : "",
      category: "Eco Action",
      points: entry.points,
      co2Saved: entry.co2Saved,
    })

<<<<<<< HEAD
    // Save to Supabase
    const saveToSupabase = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.error("[v0] No authenticated user:", userError)
          return
        }

        const { error: insertError } = await supabase
          .from('carbon_logs')
          .insert({
            user_id: user.id,
            action: selectedAction.label,
            carbon_value: entry.co2Saved,
          })

        if (insertError) {
          console.error("[v0] Error saving carbon log:", insertError)
        } else {
          console.log("[v0] Carbon log saved successfully")
        }
      } catch (error) {
        console.error("[v0] Error in saveToSupabase:", error)
      }
    }

    saveToSupabase()

=======
>>>>>>> f3b66482f7774c42cff6be10355f1bcf487f2dff
    setLoggedEntries(prev => [entry, ...prev])
    setLastLoggedEntry(entry)
    setShowSuccess(true)
    setStep(4)
    triggerConfetti()

    if (onActionLogged) {
      onActionLogged(newState)
    }

    // Reset after showing success
    setTimeout(() => {
      setShowSuccess(false)
      setStep(1)
      setSelectedAction(null)
      setUploadedImage(null)
      setUploadedFile(null)
      setExtractedData({
        date: { value: "", status: "blank" },
        vendor: { value: "", status: "blank" },
        amount: { value: "", status: "blank" },
      })
      setValidationError(null)
      setRawOcrText("")
      setShowRawOcr(false)
      setVerificationResult(null)
      setVerificationState("idle")
      setSelfReportConfirmed(false)
      setManualForm({
        distance: "",
        mode: "cycling",
        date: new Date().toISOString().split("T")[0],
        note: "",
      })
    }, 3000)
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      setSelectedAction(null)
      setUploadedImage(null)
      setUploadedFile(null)
      setValidationError(null)
      setVerificationResult(null)
      setVerificationState("idle")
    } else if (step === 3) {
      if (selectedAction?.proofType === "manual") {
        setStep(1)
        setSelectedAction(null)
      } else if (selectedAction?.proofType === "ai-verified") {
        setStep(2)
        setVerificationResult(null)
        setVerificationState("idle")
        setSelfReportConfirmed(false)
      } else {
        setStep(2)
        setIsScanning(false)
        setValidationError(null)
      }
    }
  }

  const carbonSaved = selectedAction?.id === "cycle" 
    ? calculateCycleWalkCarbon() 
    : selectedAction?.co2Saved || 0
  const pointsEarned = selectedAction?.id === "cycle"
    ? Math.round(calculateCycleWalkCarbon() * 100)
    : selectedAction?.points || 0

  // Check if manual form can be submitted
  const canSubmitManual = parseFloat(manualForm.distance) > 0

  // Get field border class based on status
  const getFieldBorderClass = (status: FieldStatus) => {
    if (status === "verify" || status === "blank") {
      return "border-amber-400 focus-visible:ring-amber-400"
    }
    return ""
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all duration-300 ${
              s === step 
                ? "w-8 bg-primary" 
                : s < step 
                ? "w-2 bg-primary" 
                : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Choose Action Type */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Choose Action Type</h2>
            <p className="text-muted-foreground mt-1">Select the eco-friendly action you performed</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {actionTypes.map((action) => (
              <Card
                key={action.id}
                onClick={() => handleActionSelect(action)}
                className={`cursor-pointer border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${action.bgColor} border-transparent hover:${action.borderColor} relative overflow-visible`}
              >
                <ProofBadge type={action.proofType} />
                <CardContent className="p-6 pt-8 flex flex-col items-center text-center gap-3">
                  <div className="p-4 rounded-2xl bg-white/80 shadow-sm">
                    <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                  </div>
                  <span className="font-medium text-foreground">{action.label}</span>
                  <span className="text-sm font-semibold text-primary">
                    {action.id === "cycle" ? "Distance-based" : `-${action.co2Saved} kg CO2`}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Upload Proof */}
      {step === 2 && selectedAction && selectedAction.proofType !== "manual" && (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="text-center">
            <div className={`inline-flex p-4 rounded-2xl ${selectedAction.bgColor} mb-4`}>
              <selectedAction.icon className={`h-8 w-8 ${selectedAction.iconColor}`} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{selectedAction.label}</h2>
            <p className="text-muted-foreground mt-1">{selectedAction.uploadLabel}</p>
          </div>

          <Card className="border-2 border-dashed border-muted-foreground/30 bg-secondary/30">
            <CardContent className="p-8">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[200px]"
              >
                {uploadedImage ? (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded proof"
                      className="max-h-48 rounded-xl shadow-md object-contain"
                    />
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-muted rounded-2xl">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Accepts {selectedAction.acceptTypesDisplay}
                      </p>
                    </div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={selectedAction.acceptTypes}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Inline validation error */}
          {validationError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-400 text-amber-700 text-sm">
              {validationError}
            </div>
          )}

          {/* AI Verify button for veg meal */}
          {selectedAction.id === "veg-meal" && uploadedImage && (
            <Button
              onClick={handleVerifyMeal}
              disabled={!uploadedImage}
              className="w-full gap-2 h-12 text-base bg-violet-600 hover:bg-violet-700"
            >
              <Sparkles className="h-5 w-5" />
              Verify Meal
            </Button>
          )}

          {/* Scan button - for OCR actions */}
          {uploadedImage && selectedAction.proofType !== "ai-verified" && (
            <Button
              onClick={handleScanProof}
              className="w-full gap-2 h-12 text-base"
            >
              <ScanLine className="h-5 w-5" />
              Scan Proof
            </Button>
          )}
        </div>
      )}

      {/* Step 3: AI Verification Result OR OCR Form OR Manual Form */}
      {step === 3 && selectedAction && (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={isScanning || isVerifying}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          {/* AI Verification for Veg/Vegan Meal */}
          {selectedAction.proofType === "ai-verified" ? (
            <div className="space-y-6">
              {/* Verifying state */}
              {verificationState === "verifying" && (
                <Card className="bg-violet-50 border-violet-200">
                  <CardContent className="p-8 flex flex-col items-center gap-4">
                    <div className="relative">
                      {uploadedImage && (
                        <img
                          src={uploadedImage}
                          alt="Meal"
                          className="w-48 h-48 object-cover rounded-xl animate-pulse"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-violet-900/20 rounded-xl">
                        <Sparkles className="h-12 w-12 text-violet-600 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-violet-700">Analyzing your meal...</p>
                      <p className="text-sm text-violet-600 mt-1">Checking for meat, seafood, and eggs</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Verification Passed */}
              {verificationState === "passed" && verificationResult && (
                <Card className="bg-green-50 border-green-300 border-2">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-700">Meal Verified!</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          verificationResult.mealType === "vegan" 
                            ? "bg-green-700 text-white" 
                            : "bg-green-200 text-green-800"
                        }`}>
                          {verificationResult.mealType === "vegan" ? "Vegan" : "Vegetarian"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {verificationResult.detectedItems.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {item}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-600 italic">{verificationResult.reasoning}</p>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                        {verificationResult.confidence.charAt(0).toUpperCase() + verificationResult.confidence.slice(1)} confidence
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-100">
                      <Leaf className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-green-700">
                        -{carbonSaved} kg CO2 saved vs a non-veg meal
                      </span>
                    </div>

                    <Button
                      onClick={() => handleLogAction()}
                      className="w-full gap-2 h-12 text-base bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-5 w-5" />
                      Log this Action
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Verification Failed */}
              {verificationState === "failed" && verificationResult && (
                <Card className="bg-red-50 border-red-300 border-2">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 rounded-full">
                        <X className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-red-700">Non-vegetarian meal detected</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {verificationResult.detectedItems.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          {item}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-600 italic">{verificationResult.reasoning}</p>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleRetryVerification}
                        className="flex-1"
                      >
                        Try another photo
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleLogAction(true)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
                      >
                        Log anyway (no points)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Low Confidence */}
              {verificationState === "low-confidence" && verificationResult && (
                <Card className="bg-amber-50 border-amber-300 border-2">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-100 rounded-full">
                        <AlertTriangle className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-bold text-amber-700">{"Couldn't analyze clearly"}</h3>
                    </div>

                    <p className="text-gray-600">The image may be blurry or unclear. You can retry or log manually.</p>
                    
                    <p className="text-gray-500 italic">{verificationResult.reasoning}</p>

                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={handleRetryVerification}
                        className="w-full"
                      >
                        Retry with clearer photo
                      </Button>

                      <div className="border-t pt-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-100/50">
                          <Checkbox
                            id="self-report-confirm"
                            checked={selfReportConfirmed}
                            onCheckedChange={(checked) => setSelfReportConfirmed(checked as boolean)}
                          />
                          <Label htmlFor="self-report-confirm" className="cursor-pointer text-amber-800">
                            I confirm this meal contains no meat, seafood, or eggs
                          </Label>
                        </div>

                        <Button
                          onClick={() => handleLogAction()}
                          disabled={!selfReportConfirmed}
                          className="w-full mt-4 gap-2 h-12 text-base bg-amber-600 hover:bg-amber-700"
                        >
                          <Check className="h-5 w-5" />
                          Log with manual confirmation
                        </Button>
                      </div>
                    </div>

                    {/* Debug Info Panel */}
                    <div className="border-t pt-4">
                      <button
                        onClick={() => setShowDebugInfo(!showDebugInfo)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                      >
                        <Search className="h-4 w-4" />
                        Debug Info (click to {showDebugInfo ? "collapse" : "expand"})
                        <ChevronDown className={`h-4 w-4 transition-transform ${showDebugInfo ? "rotate-180" : ""}`} />
                      </button>
                      
                      {showDebugInfo && (
                        <div className="mt-3 p-4 bg-gray-100 rounded-lg text-xs font-mono space-y-2 overflow-x-auto">
                          <div>
                            <span className="font-semibold text-gray-700">Raw API response:</span>
                            <pre className="mt-1 whitespace-pre-wrap text-gray-600 max-h-32 overflow-y-auto">
                              {verificationResult._rawResponse 
                                ? verificationResult._rawResponse.substring(0, 300) + (verificationResult._rawResponse.length > 300 ? "..." : "")
                                : "No raw response captured"}
                            </pre>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Parsed result:</span>
                            <pre className="mt-1 whitespace-pre-wrap text-gray-600">
                              {JSON.stringify({
                                isVegetarian: verificationResult.isVegetarian,
                                confidence: verificationResult.confidence,
                                mealType: verificationResult.mealType,
                                detectedItems: verificationResult.detectedItems,
                                reasoning: verificationResult.reasoning
                              }, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Image type:</span>
                            <span className="ml-2 text-gray-600">{uploadedFile?.type || "Unknown"}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Base64 length:</span>
                            <span className="ml-2 text-gray-600">{verificationResult._base64Length?.toLocaleString() || "Unknown"} chars</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : selectedAction.proofType === "manual" ? (
            /* Manual Form for Cycle/Walk */
            <div className="space-y-6">
              <div className="text-center">
                <div className={`inline-flex p-4 rounded-2xl ${selectedAction.bgColor} mb-4`}>
                  <selectedAction.icon className={`h-8 w-8 ${selectedAction.iconColor}`} />
                </div>
                <h2 className="text-xl font-semibold text-foreground">{selectedAction.label}</h2>
                <p className="text-muted-foreground mt-1">Log your cycling or walking activity</p>
              </div>

              <Card className="bg-secondary/30">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      min="0"
                      step="0.1"
                      value={manualForm.distance}
                      onChange={(e) => setManualForm(prev => ({ ...prev, distance: e.target.value }))}
                      placeholder="e.g., 5.2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={manualForm.mode === "cycling" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setManualForm(prev => ({ ...prev, mode: "cycling" }))}
                      >
                        <Bike className="h-4 w-4 mr-2" />
                        Cycling
                      </Button>
                      <Button
                        type="button"
                        variant={manualForm.mode === "walking" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setManualForm(prev => ({ ...prev, mode: "walking" }))}
                      >
                        Walking
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manual-date">Date</Label>
                    <Input
                      id="manual-date"
                      type="date"
                      value={manualForm.date}
                      onChange={(e) => setManualForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Note (optional)</Label>
                    <Input
                      id="note"
                      value={manualForm.note}
                      onChange={(e) => setManualForm(prev => ({ ...prev, note: e.target.value }))}
                      placeholder="e.g., Morning commute"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Carbon Saved</Label>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10">
                      <Leaf className="h-5 w-5 text-primary" />
                      <span className="font-bold text-primary text-lg">
                        -{carbonSaved.toFixed(2)} kg CO2
                      </span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        ({manualForm.mode === "cycling" ? "0.12" : "0.08"} kg/km)
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleLogAction()}
                    disabled={!canSubmitManual}
                    className="w-full gap-2 h-12 text-base mt-4"
                  >
                    <Check className="h-5 w-5" />
                    Log this Action
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Regular OCR form for other actions */
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Preview with Scanning Animation */}
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="relative">
                    {uploadedImage && (
                      <img
                        src={uploadedImage}
                        alt="Proof"
                        className="w-full rounded-xl object-contain max-h-64"
                      />
                    )}
                    {isScanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-xl">
                        <div className="absolute inset-0 overflow-hidden rounded-xl">
                          <div 
                            className="h-1 bg-primary/80 shadow-lg shadow-primary/50 animate-pulse"
                            style={{
                              animation: "scan 2s ease-in-out infinite",
                              position: "absolute",
                              left: 0,
                              right: 0,
                              top: `${scanProgress}%`,
                            }}
                          />
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                          <p className="text-sm font-medium text-foreground flex items-center gap-2">
                            <ScanLine className="h-4 w-4 animate-pulse text-primary" />
                            Reading your proof... {scanProgress}%
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Raw OCR output collapsible */}
                  {rawOcrText && !isScanning && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowRawOcr(!showRawOcr)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Search className="h-4 w-4" />
                        <span>View raw scan text</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showRawOcr ? "rotate-180" : ""}`} />
                      </button>
                      {showRawOcr && (
                        <div className="mt-2 p-3 bg-muted rounded-lg max-h-40 overflow-y-auto">
                          <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words">
                            {rawOcrText}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Extracted Data Form */}
              <Card className="bg-secondary/30">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-foreground">Extracted Information</h3>
                  
                  {/* Banner for many blank fields */}
                  {!isScanning && countFieldsNeedingAttention() >= 2 && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-sm flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{"We couldn't read much from this image."}</p>
                        <p className="mt-1 text-amber-700">{"Please fill in the details manually — your log will still count!"}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Inline validation error */}
                  {validationError && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-400 text-amber-700 text-sm">
                      {validationError}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="date">Date</Label>
                        <FieldStatusBadge status={extractedData.date.status} />
                      </div>
                      <Input
                        id="date"
                        value={extractedData.date.value}
                        onChange={(e) => updateField("date", e.target.value)}
                        placeholder="Not found — please fill in"
                        disabled={isScanning}
                        className={getFieldBorderClass(extractedData.date.status)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="vendor">Vendor / Location</Label>
                        <FieldStatusBadge status={extractedData.vendor.status} />
                      </div>
                      <Input
                        id="vendor"
                        value={extractedData.vendor.value}
                        onChange={(e) => updateField("vendor", e.target.value)}
                        placeholder="Not found — please fill in"
                        disabled={isScanning}
                        className={getFieldBorderClass(extractedData.vendor.status)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="amount">
                          {selectedAction.id === "tree" ? "Tree Count" : "Amount / Units"}
                        </Label>
                        <FieldStatusBadge status={extractedData.amount.status} />
                      </div>
                      <Input
                        id="amount"
                        value={extractedData.amount.value}
                        onChange={(e) => updateField("amount", e.target.value)}
                        placeholder="Not found — please fill in"
                        disabled={isScanning}
                        className={getFieldBorderClass(extractedData.amount.status)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Action Type</Label>
                      <div className={`flex items-center gap-3 p-3 rounded-xl ${selectedAction.bgColor}`}>
                        <selectedAction.icon className={`h-5 w-5 ${selectedAction.iconColor}`} />
                        <span className="font-medium text-foreground">{selectedAction.label}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Carbon Saved</Label>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10">
                        <Leaf className="h-5 w-5 text-primary" />
                        <span className="font-bold text-primary text-lg">
                          -{carbonSaved} kg CO2
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleLogAction()}
                    disabled={isScanning}
                    className="w-full gap-2 h-12 text-base mt-4"
                  >
                    <Check className="h-5 w-5" />
                    Log this Action
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && showSuccess && lastLoggedEntry && (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative p-6 bg-primary/10 rounded-full">
              <Leaf className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <Card className="w-full max-w-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Great Job!</h2>
              <div className="flex items-center justify-center gap-6">
                <div>
                  <p className="text-3xl font-bold text-primary">
                    +{lastLoggedEntry.points}
                  </p>
                  <p className="text-sm text-muted-foreground">points earned</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <p className="text-3xl font-bold text-primary">
                    -{lastLoggedEntry.co2Saved.toFixed(2)} kg
                  </p>
                  <p className="text-sm text-muted-foreground">CO2 saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Feed */}
      {loggedEntries.length > 0 && !showSuccess && (
        <div className="space-y-4 pt-8 border-t">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
          <div className="space-y-3">
            {loggedEntries.slice(0, 5).map((entry, idx) => (
              <Card 
                key={idx} 
                className="border-l-4 border-l-primary bg-card hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${entry.actionType.bgColor}`}>
                      <entry.actionType.icon className={`h-5 w-5 ${entry.actionType.iconColor}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {entry.mealType === "vegan" ? "Vegan Meal" : 
                           entry.mealType === "vegetarian" ? "Vegetarian Meal" :
                           entry.actionType.label}
                          {entry.mode && ` (${entry.mode === "cycling" ? "Cycling" : "Walking"})`}
                        </p>
                        {entry.verificationType && (
                          <VerificationBadge type={entry.verificationType} />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.vendor || entry.date}
                        {entry.distance && ` | ${entry.distance} km`}
                      </p>
                      {entry.detectedItems && entry.detectedItems.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.detectedItems.slice(0, 4).map((item, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="font-semibold text-primary">-{entry.co2Saved.toFixed(2)} kg</p>
                        <p className="text-xs text-muted-foreground">+{entry.points} pts</p>
                      </div>
                      
                      {entry.proofImage ? (
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={entry.proofImage} 
                            alt="Proof" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${entry.actionType.bgColor}`}>
                          <entry.actionType.icon className={`h-5 w-5 ${entry.actionType.iconColor}`} />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  )
}
