'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { brand } from '@/config/brand'

const inquireSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  propertyType: z.string().min(1, 'Please select a property type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  isBroker: z.boolean().optional(),
  smsConsent: z.boolean().optional(),
  privacyAccepted: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
})

type InquireFormData = z.infer<typeof inquireSchema>

interface InquireModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InquireModal({ isOpen, onClose }: InquireModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<InquireFormData>({
    resolver: zodResolver(inquireSchema),
    defaultValues: {
      isBroker: false,
      smsConsent: false,
      privacyAccepted: false
    }
  })

  const onSubmit = async (data: InquireFormData) => {
    // Static form - just log to console
    console.log('Form submitted:', data)
    alert('Thank you for your inquiry! We will be in touch soon.')
    reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white z-[70] overflow-y-auto"
          >
            {/* Header */}
            <div
              className="sticky top-0 flex items-center justify-between px-6 py-4 border-b"
              style={{ backgroundColor: brand.colors.light }}
            >
              <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: brand.colors.primary }}
              >
                inquire
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <h1
                className="text-3xl font-serif mb-4"
                style={{ color: brand.colors.dark }}
              >
                Inquire
              </h1>

              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                Ownership opportunities start at {brand.contact.startingPrice}.
                Construction is well underway — with the first residences available {brand.contact.availability}.
                With only {brand.contact.residenceCount} finely furnished Residences and
                just {brand.contact.estateCount} homesites within The Estates,
                there&apos;s no better moment than right now.
              </p>

              <div
                className="text-xs tracking-[0.15em] uppercase mb-6"
                style={{ color: brand.colors.primary }}
              >
                Contact Info
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                      First Name*
                    </label>
                    <input
                      {...register('firstName')}
                      placeholder="First Name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                      Last Name*
                    </label>
                    <input
                      {...register('lastName')}
                      placeholder="Last Name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                      Email*
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                      Phone Number*
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                    Which kind of property interests you?*
                  </label>
                  <select
                    {...register('propertyType')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors bg-white"
                  >
                    <option value="">Choose one</option>
                    {brand.contact.propertyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.propertyType && (
                    <p className="text-red-500 text-xs mt-1">{errors.propertyType.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                    Message*
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="I'm inquiring about..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Broker checkbox */}
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-500 mb-3">
                    Are you working with a broker?*
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        {...register('isBroker')}
                        value="true"
                        className="w-4 h-4"
                      />
                      <span className="text-sm">YES</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        {...register('isBroker')}
                        value="false"
                        className="w-4 h-4"
                      />
                      <span className="text-sm">NO</span>
                    </label>
                  </div>
                </div>

                {/* Consent checkboxes */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('smsConsent')}
                      className="w-4 h-4 mt-0.5"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to receive SMS updates and communications
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('privacyAccepted')}
                      className="w-4 h-4 mt-0.5"
                    />
                    <span className="text-sm text-gray-600">
                      I have read, and I agree and consent to the terms of the{' '}
                      <a
                        href="/privacy"
                        className="underline hover:no-underline"
                        style={{ color: brand.colors.primary }}
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {errors.privacyAccepted && (
                    <p className="text-red-500 text-xs">{errors.privacyAccepted.message}</p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-full text-white font-medium tracking-wide transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: brand.colors.primary }}
                >
                  {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                </motion.button>

                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By providing your phone number, you consent to receive updates, news,
                  and exclusive offers via SMS from {brand.name}. You may opt out at any
                  time by replying &quot;STOP&quot; to any message. Message and data rates may apply.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
