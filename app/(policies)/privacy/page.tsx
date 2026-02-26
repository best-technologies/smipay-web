import Header from "@/components/Header-new";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        {/* Desktop Banner (1440px) */}
        <div className="hidden xl:block relative h-60 w-full">
          <Image
            src="/svgs/heros/banner.svg"
            alt="Privacy Policy Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
            <h1 className="text-4xl lg:text-5xl text-brand-text-primary font-bold text-center">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-[#9CA3AF]">
              Last updated: Febuary 26, 2026
            </p>
          </div>
        </div>

        {/* Laptop Banner (1024px) */}
        <div className="hidden lg:block xl:hidden relative h-[171px] w-full">
          <Image
            src="/svgs/heros/small-laptop.svg"
            alt="Privacy Policy Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
            <h1 className="text-3xl font-bold text-center text-brand-text-primary">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-[#9CA3AF]">
              Last updated: Febuary 26, 2026
            </p>
          </div>
        </div>

        {/* Tablet Banner (768px) */}
        <div className="hidden md:block lg:hidden relative h-32 w-full">
          <Image
            src="/svgs/heros/tablet.svg"
            alt="Privacy Policy Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
            <h1 className="text-2xl font-bold text-center text-brand-text-primary">
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs text-[#9CA3AF]">
              Last updated: Febuary 26, 2026
            </p>
          </div>
        </div>

        {/* Mobile Banner */}
        <div className="md:hidden relative h-[167px] w-full">
          <Image
            src="/svgs/heros/banner-mobile.svg"
            alt="Privacy Policy Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
            <h1 className="text-2xl font-bold text-center text-brand-text-primary">
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs text-[#9CA3AF]">
              Last updated: Febuary 26, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed">
              Smipay (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is
              committed to protecting your personal information and respecting
              your privacy. This Privacy Policy explains how we collect, use,
              store, and protect your data when you use the Smipay mobile app,
              website, and related services (&quot;Services&quot;).
            </p>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mt-3">
              By using Smipay, you agree to the practices described in this
              Privacy Policy.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary mt-8 mb-4">
              Information We Collect
            </h2>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mb-4">
              We collect information in order to create and secure your account,
              process transactions, improve Smipay, meet legal obligations, and
              keep your experience safe. The categories below describe what we
              collect when you use the app or website.
            </p>

            <h3 className="text-lg md:text-xl font-semibold text-brand-text-primary mt-6 mb-3">
              1. Personal Information
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-brand-text-secondary">
              <li>Full name and contact details (email address, phone number)</li>
              <li>Date of birth and residential / billing address where required</li>
              <li>
                Identity information for KYC/AML purposes (such as BVN, NIN, ID card
                details) where required by law or our partners
              </li>
              <li>Account login details (hashed passwords, security settings)</li>
            </ul>

            <h3 className="text-lg md:text-xl font-semibold text-brand-text-primary mt-6 mb-3">
              2. Transaction Information
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-brand-text-secondary">
              <li>Payment history</li>
              <li>Electricity meter details</li>
              <li>Airtime and data purchase details</li>
              <li>Cable subscription details</li>
              {/* <li>Virtual card transactions</li> */}
            </ul>

            <h3 className="text-lg md:text-xl font-semibold text-brand-text-primary mt-6 mb-3">
              3. Device & Technical Information
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-brand-text-secondary">
              <li>IP address</li>
              <li>Device model</li>
              <li>Operating system</li>
              <li>App version and performance data</li>
              <li>Browser type (for web access)</li>
              <li>Mobile network provider</li>
              <li>
                Device identifiers and diagnostic information (such as device IDs or
                crash logs) used to secure your account, prevent fraud, and improve
                stability
              </li>
            </ul>

            <h3 className="text-lg md:text-xl font-semibold text-brand-text-primary mt-6 mb-3">
              4. Cookies and Tracking Technologies
            </h3>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed">
              We use cookies, pixels, and analytics tools to understand usage
              patterns, maintain security, and improve our platform. These
              technologies may collect anonymized or pseudonymized identifiers.
              You can control cookies through your browser settings. See our
              Cookies Policy for more details.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary mt-8 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mb-3">
              Smipay uses your information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-brand-text-secondary">
              <li>Create and manage your account</li>
              <li>Process payments and provide services</li>
              <li>Verify your identity and comply with KYC/AML regulations</li>
              <li>Improve app performance and user experience</li>
              <li>Personalize your dashboard and recommendations</li>
              <li>Respond to customer support inquiries</li>
              <li>Prevent fraud, unauthorized activity, or misuse</li>
              <li>
                Communicate updates, promotional messages, and important notices
              </li>
            </ul>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mt-3">
              We will only process your data for lawful purposes as permitted by
              the Nigeria Data Protection Regulation (NDPR).
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary mt-8 mb-4">
              How We Share Your Information
            </h2>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mb-4">
              We may share your information with:
            </p>

            <h3 className="text-lg md:text-xl font-semibold text-brand-text-primary mt-6 mb-3">
              1. Third-Party Service Providers
            </h3>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mb-3">
              Such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-brand-text-secondary">
              <li>Payment processors</li>
              <li>Banks and financial institutions</li>
              <li>Utility providers (electricity, cable, telecoms)</li>
              <li>Identity verification services</li>
              <li>Analytics and security providers</li>
            </ul>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mt-3">
              These providers only receive the data needed to perform their
              duties.
            </p>

            <h3 className="text-lg md:text-xl font-semibold text-brand-text-primary mt-6 mb-3">
              2. Regulatory Authorities
            </h3>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mb-3">
              We may disclose information if required by:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-brand-text-secondary">
              <li>Law enforcement</li>
              <li>Courts</li>
              <li>Financial regulators</li>
              <li>Anti-fraud agencies</li>
            </ul>

            <h3 className="text-lg md:text-xl font-semibold text-brand-text-primary mt-6 mb-3">
              3. Business Transfers
            </h3>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed">
              If Smipay undergoes a merger, acquisition, or restructuring, your
              data may be transferred as part of the transaction.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary mt-8 mb-4">
              How We Protect Your Information
            </h2>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mb-3">
              We use industry-standard security measures to protect your data,
              including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-brand-text-secondary">
              <li>Encryption</li>
              <li>Secure data storage</li>
              <li>Firewalls</li>
              <li>Multi-factor authentication</li>
              <li>Strict access controls</li>
            </ul>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mt-3">
              While we strive to protect your data, no system is completely
              secure. Users must also keep their login details confidential.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary mt-8 mb-4">
              Account Deletion and Data Erasure
            </h2>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mb-3">
              You can request that your Smipay account be closed and your
              personal data deleted:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-brand-text-secondary">
              <li>
                From within the app (where available) by navigating to{" "}
                <strong>Settings &gt; Account &gt; Delete account</strong>, or
              </li>
              <li>
                By sending an email from your registered email address to{" "}
                <strong>support@smipay.com</strong> with the subject line
                &quot;Account deletion request&quot;.
              </li>
            </ul>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mt-3">
              We may ask you to verify your identity before processing deletion
              requests. Once confirmed, we will deactivate your account and
              permanently delete or anonymize personal data that we are not
              legally required to retain (for example, records needed for
              anti‑money‑laundering, tax, or regulatory purposes). Where we must
              retain limited information, we will restrict its use to compliance
              and audit purposes only.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary mt-8 mb-4">
              Data Retention
            </h2>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mb-3">
              We retain your information only as long as necessary for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-brand-text-secondary">
              <li>Providing services</li>
              <li>Fulfilling legal obligations</li>
              <li>Resolving disputes</li>
              <li>Detecting fraud</li>
            </ul>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mt-3">
              After this period, your data is securely deleted or anonymized.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary mt-8 mb-4">
              Your Rights
            </h2>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mb-3">
              Under the Nigeria Data Protection Regulation, you have the right
              to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-brand-text-secondary">
              <li>Access your personal data</li>
              <li>Update or correct your information</li>
              <li>Request data deletion</li>
              <li>Withdraw consent</li>
              <li>Restrict processing</li>
              <li>Object to certain types of processing</li>
              <li>Request data portability</li>
            </ul>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mt-3">
              To exercise any of these rights, please contact us via{" "}
              <strong>support@smipay.com</strong>. We will respond to verified
              requests within a reasonable period and in line with NDPR and any
              other applicable regulations.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary mt-8 mb-4">
              Children&apos;s Privacy
            </h2>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed">
              Smipay does not knowingly collect information from individuals
              under 18 years old. If we discover such data, it will be deleted
              immediately.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary mt-8 mb-4">
              International Transfers
            </h2>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed">
              If your data is transferred outside Nigeria, Smipay ensures that
              appropriate safeguards are in place in accordance with NDPR
              requirements.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary mt-8 mb-4">
              Updates to This Policy
            </h2>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed">
              We may update this policy occasionally. Changes will be posted on
              the app or website. Continued use means acceptance of the updated
              policy.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary mt-8 mb-4">
              Contact Information
            </h2>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mb-3">
              For questions or support, contact us at:
            </p>
            <ul className="list-none pl-0 space-y-2 text-sm md:text-base text-brand-text-secondary">
              <li>Email: support@smipay.com</li>
              <li>Phone: +234 816 876 7809</li>
              <li>Address: The Knowledge Hub, Oke Ado, Ibadan. Oyo, Nigeria</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
