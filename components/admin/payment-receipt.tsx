"use client"

import { QRCodeSVG } from "qrcode.react"
import { formatINR, formatDate } from "@/lib/format"
import type { Payment, Student, Course } from "@/lib/types"

type Props = {
  payment: Payment
  student: Student
  course?: Course
  receiptNumber?: string
}

export function PaymentReceipt({ payment, student, course, receiptNumber }: Props) {
  const qrValue = `Receipt: ${receiptNumber || payment.id}\nStudent: ${student.name}\nAmount: ${payment.amount}`
  const remainingFees = student.totalFees - (student.paidFees + payment.amount)

  return (
    <div className="w-full max-w-4xl bg-white p-8 font-sans">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-8 border-b border-gray-200 pb-6">
        <div className="flex items-start gap-4">
          {/* Logo Placeholder */}
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-amber-500 text-2xl font-bold text-white">
            PC
          </div>
          <div className="pt-2">
            <h1 className="text-2xl font-bold text-gray-900">PHOENIX COMPUTERS</h1>
            <p className="text-sm text-gray-600">Computer Training Institute</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-bold text-gray-900">INVOICE</h2>
        </div>
      </div>

      {/* Invoice & Student Details */}
      <div className="mb-8 grid gap-8 md:grid-cols-2">
        <div>
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-600">INVOICE NUMBER</p>
            <p className="text-lg font-bold text-gray-900">{receiptNumber || payment.id}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-600">INVOICE DATE</p>
            <p className="text-lg font-bold text-gray-900">{formatDate(payment.date)}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">PAYMENT METHOD</p>
            <p className="text-lg font-bold text-gray-900">{payment.mode}</p>
          </div>
        </div>

        <div>
          <p className="mb-4 text-lg font-bold text-gray-900">STUDENT DETAILS</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Name</span>
              <span className="text-gray-900">{student.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Student ID</span>
              <span className="text-gray-900">{student.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Mobile</span>
              <span className="text-gray-900">{student.mobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Course</span>
              <span className="text-gray-900">{student.course}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Batch</span>
              <span className="text-gray-900">{student.batch}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Table */}
      <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-amber-500 text-white">
              <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-bold">NO</th>
              <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-bold">COURSE</th>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-bold">PRICE</th>
              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-bold">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">1</td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900">{student.course}</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                {formatINR(student.totalFees)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                {formatINR(student.totalFees)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Summary & QR Code */}
      <div className="mb-8 grid gap-8 md:grid-cols-3">
        {/* Payment Details */}
        <div className="md:col-span-2">
          <div className="mb-4">
            <p className="mb-2 font-bold text-gray-900">PAYMENT METHOD</p>
            <p className="text-sm text-gray-600">Mode: {payment.mode}</p>
          </div>
          <div>
            <p className="mb-2 font-bold text-gray-900">TERMS AND CONDITIONS</p>
            <p className="text-xs text-gray-600">
              Please make the payment by the due date to the account below. We accept bank transfer,
              credit card, or check.
            </p>
          </div>
        </div>

        {/* Summary Box with QR Code */}
        <div className="space-y-4">
          {/* Summary */}
          <div className="space-y-2 text-right text-sm">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">PAID</span>
              <span className="font-bold text-gray-900">{formatINR(payment.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">REMAINING FEE</span>
              <span className="font-bold text-gray-900">{formatINR(remainingFees)}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-amber-500 px-3 py-2 text-white">
              <span className="font-bold">SUB TOTAL</span>
              <span className="font-bold">{formatINR(payment.amount)}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg border-2 border-gray-300 p-2">
              <QRCodeSVG value={qrValue} size={120} level="H" includeMargin={false} />
            </div>
            <p className="text-xs text-gray-600">Scan to verify</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-900 px-6 py-4 text-center text-xs text-white">
        <p className="mb-1 font-semibold">THANK YOU FOR CHOOSING PHOENIX COMPUTERS</p>
        <p>
          16/563 Sangram Chowk, Ichalkaranji - +91 7796380995 - phoenixcomputers1997@gmail.com -
          phoenixcomputers.online
        </p>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .payment-receipt {
            box-shadow: none;
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  )
}
