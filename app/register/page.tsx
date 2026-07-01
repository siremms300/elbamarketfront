'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sprout, ArrowRight, Eye, EyeOff, AlertCircle, Tractor, Store, Warehouse, Truck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const roles = [
  { value: 'farmer', label: 'Farmer', description: 'I want to list my produce', icon: Tractor },
  { value: 'buyer', label: 'Buyer', description: 'I want to source commodities', icon: Store },
  { value: 'warehouse_operator', label: 'Warehouse Operator', description: 'I manage a storage facility', icon: Warehouse },
  { value: 'logistics_partner', label: 'Logistics Partner', description: 'I transport goods', icon: Truck },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      router.push('/market');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-elba-primary rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-elba-primary">Elba Market</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8">
          {/* Steps */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === 1 ? 'bg-elba-primary text-white' : 'bg-elba-secondary text-white'}`}>1</div>
            <div className="flex-1 h-0.5 bg-gray-200">
              <div className={`h-full bg-elba-secondary transition-all ${step === 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === 2 ? 'bg-elba-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-bold text-elba-primary text-center">Choose your role</h1>
              <p className="text-sm text-gray-500 text-center mt-2">How will you use Elba Market?</p>

              <div className="mt-6 space-y-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => {
                      setFormData({ ...formData, role: role.value });
                      setStep(2);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left
                      ${formData.role === role.value
                        ? 'border-elba-secondary bg-elba-secondary/5'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.role === role.value ? 'bg-elba-secondary text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <role.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-elba-primary text-sm">{role.label}</p>
                      <p className="text-xs text-gray-500">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-elba-secondary font-semibold hover:text-elba-secondary-light transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:text-elba-primary transition-colors mb-4"
              >
                ← Back
              </button>

              <h1 className="text-2xl font-bold text-elba-primary">Create your account</h1>
              <p className="text-sm text-gray-500 mt-1">You&apos;re registering as a <span className="font-semibold text-elba-primary capitalize">{formData.role.replace('_', ' ')}</span></p>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="080XXXXXXXX"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-elba-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl shadow-lg shadow-elba-primary/10 hover:shadow-elba-primary/20 transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? 'Creating account...' : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-elba-secondary font-semibold hover:text-elba-secondary-light transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}