'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface CheckoutStepsProps {
  currentStep: number
  steps: {
    title: string
    description: string
  }[]
}

export default function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index
          const isCurrent = currentStep === index
          
          return (
            <div key={step.title} className="flex-1">
              <div className="relative flex flex-col items-center">
                {/* 连接线 */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-0.5 ${
                      isCompleted ? 'bg-black' : 'bg-gray-200'
                    }`}
                  />
                )}
                
                {/* 步骤圆圈 */}
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted || isCurrent ? '#000' : '#fff',
                    borderColor: isCompleted || isCurrent ? '#000' : '#e5e7eb',
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors"
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={isCurrent ? 'text-white' : 'text-gray-500'}>
                      {index + 1}
                    </span>
                  )}
                </motion.div>
                
                {/* 步骤文字 */}
                <div className="mt-4 text-center">
                  <div className={`font-medium ${isCurrent ? 'text-black' : 'text-gray-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 