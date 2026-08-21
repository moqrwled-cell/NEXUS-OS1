import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Smartphone, MessageSquare, Hash, Send, Copy, X, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

export default function IntegrationModal({ type, onClose, onConnect, isRtl }) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(null);
  const [waStatus, setWaStatus] = useState('initializing');
  const [waQrCode, setWaQrCode] = useState(null);

  useEffect(() => {
    let interval;
    if (type === 'wa') {
      const fetchStatus = async () => {
        try {
          const res = await fetch('http://localhost:3001/api/wa/status');
          const data = await res.json();
          setWaStatus(data.status);
          setWaQrCode(data.qr);
        } catch (e) {
          setWaStatus('disconnected');
        }
      };
      fetchStatus();
      interval = setInterval(fetchStatus, 2000);
    }
    return () => clearInterval(interval);
  }, [type]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const platforms = {
    wa: {
      icon: <MessageCircle size={32} />,
      color: 'bg-green-500/20 text-green-400',
      titleEn: 'Connect WhatsApp',
      titleAr: 'ربط واتساب (SaaS Local)',
      subtitle: 'Scan QR to start 24/7 Bot',
      steps: [
        {
          titleEn: 'Open WhatsApp',
          titleAr: 'افتح تطبيق واتساب',
          descEn: 'Open WhatsApp on your phone, go to Settings -> Linked Devices.',
          descAr: 'افتح واتساب على هاتفك، اذهب إلى الإعدادات ثم الأجهزة المرتبطة (Linked Devices).'
        },
        {
          titleEn: 'Scan QR Code',
          titleAr: 'امسح رمز الـ QR',
          descEn: 'Scan the QR code below to connect your AI Agent.',
          descAr: 'قم بمسح رمز الـ QR أدناه لربط وكيل الذكاء الاصطناعي الخاص بك.',
          customContent: true
        }
      ]
    },
    ig: {
      icon: <Smartphone size={32} />,
      color: 'bg-purple-500/20 text-purple-400',
      titleEn: 'Connect Instagram',
      titleAr: 'ربط إنستغرام',
      subtitle: 'Instagram Graph API Setup',
      steps: [
        {
          titleEn: 'Connect FB Page',
          titleAr: 'ربط صفحة الفيسبوك',
          descEn: 'Ensure your Instagram Professional account is linked to a Facebook Page.',
          descAr: 'تأكد من أن حساب إنستغرام الاحترافي الخاص بك مربوط بصفحة فيسبوك.'
        },
        {
          titleEn: 'Configure Webhook',
          titleAr: 'إعداد الـ Webhook',
          descEn: <>In your <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer" className="text-nexus-mint hover:underline font-bold">Meta App</a>, add Instagram Graph API and set this Webhook URL:</>,
          descAr: <>في <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer" className="text-nexus-mint hover:underline font-bold">تطبيق Meta الخاص بك</a>، أضف Instagram Graph API وضع هذا الرابط:</>,
          copyData: 'https://api.nexusos.com/v1/webhook/ig/85c8',
          labelEn: 'Webhook URL',
          labelAr: 'رابط Webhook'
        },
        {
          titleEn: 'Subscribe to Messages',
          titleAr: 'الاشتراك في الرسائل',
          descEn: 'Subscribe your app to the "messages" field using this Verify Token:',
          descAr: 'اشترك في حقل "messages" باستخدام هذا الرمز السري:',
          copyData: 'nexus_verify_9982x',
          labelEn: 'Verify Token',
          labelAr: 'الرمز السري'
        }
      ]
    },
    fb: {
      icon: <MessageSquare size={32} />,
      color: 'bg-blue-500/20 text-blue-400',
      titleEn: 'Connect Facebook Messenger',
      titleAr: 'ربط ماسنجر الفيسبوك',
      subtitle: 'Messenger Platform Setup',
      steps: [
        {
          titleEn: 'Select Page',
          titleAr: 'اختيار الصفحة',
          descEn: <>Go to your <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer" className="text-nexus-mint hover:underline font-bold">Meta App dashboard</a> and add the Messenger product. Select your Facebook Page to generate an Access Token.</>,
          descAr: <>اذهب إلى <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer" className="text-nexus-mint hover:underline font-bold">لوحة تحكم Meta App</a> وأضف منتج Messenger. اختر صفحتك لاستخراج الـ Access Token.</>
        },
        {
          titleEn: 'Configure Webhook',
          titleAr: 'إعداد الـ Webhook',
          descEn: 'Set up the Webhook for Messenger using this URL:',
          descAr: 'قم بإعداد الـ Webhook الخاص بـ Messenger باستخدام هذا الرابط:',
          copyData: 'https://api.nexusos.com/v1/webhook/fb/85c8',
          labelEn: 'Webhook URL',
          labelAr: 'رابط Webhook'
        },
        {
          titleEn: 'Verify Token',
          titleAr: 'تأكيد الرمز السري',
          descEn: 'Paste this token to verify your webhook connection:',
          descAr: 'انسخ هذا الرمز لتأكيد اتصال الـ Webhook:',
          copyData: 'nexus_verify_9982x',
          labelEn: 'Verify Token',
          labelAr: 'الرمز السري'
        }
      ]
    },
    x: {
      icon: <Hash size={32} />,
      color: 'bg-gray-500/20 text-gray-200',
      titleEn: 'Connect X (Twitter)',
      titleAr: 'ربط منصة X (تويتر)',
      subtitle: 'X Developer API V2',
      steps: [
        {
          titleEn: 'Developer Portal',
          titleAr: 'بوابة المطورين',
          descEn: <>Create a Project and App in the <a href="https://developer.x.com/en/portal/dashboard" target="_blank" rel="noreferrer" className="text-nexus-mint hover:underline font-bold">X Developer Portal</a>. Get your API Key and Secret.</>,
          descAr: <>أنشئ مشروعاً وتطبيقاً في <a href="https://developer.x.com/en/portal/dashboard" target="_blank" rel="noreferrer" className="text-nexus-mint hover:underline font-bold">بوابة مطوري X</a>. استخرج الـ API Key و Secret.</>
        },
        {
          titleEn: 'Enable DMs',
          titleAr: 'تفعيل الرسائل الخاصة (DMs)',
          descEn: 'In App Settings, set User Authentication Settings to "Read, Write, and Direct Messages".',
          descAr: 'في إعدادات التطبيق، اجعل الصلاحيات "Read, Write, and Direct Messages".'
        },
        {
          titleEn: 'Set Webhook (Account Activity)',
          titleAr: 'ربط الـ Webhook',
          descEn: 'Register this webhook URL to receive incoming DMs automatically:',
          descAr: 'قم بتسجيل هذا الرابط لاستقبال الرسائل الخاصة (DMs) تلقائياً:',
          copyData: 'https://api.nexusos.com/v1/webhook/x/85c8',
          labelEn: 'Environment Webhook URL',
          labelAr: 'رابط بيئة الـ Webhook'
        }
      ]
    },
    tg: {
      icon: <Send size={32} />,
      color: 'bg-sky-500/20 text-sky-400',
      titleEn: 'Connect Telegram',
      titleAr: 'ربط تليجرام',
      subtitle: 'Telegram Bot API',
      steps: [
        {
          titleEn: 'Talk to BotFather',
          titleAr: 'التحدث مع BotFather',
          descEn: <>Open Telegram and search for <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-nexus-mint hover:underline font-bold">@BotFather</a>. Send /newbot to create a new bot and get your Bot Token.</>,
          descAr: <>افتح تليجرام وابحث عن <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-nexus-mint hover:underline font-bold">@BotFather</a>. أرسل /newbot لإنشاء بوت جديد واحصل على الـ Bot Token.</>
        },
        {
          titleEn: 'Set Webhook URL',
          titleAr: 'تحديد رابط הـ Webhook',
          descEn: 'We will automatically set the webhook for you. Just copy your Bot Token from BotFather.',
          descAr: 'سنقوم نحن ببرمجة الـ Webhook تلقائياً. فقط احصل على الـ Token من BotFather.'
        },
        {
          titleEn: 'Paste Bot Token',
          titleAr: 'لصق الـ Bot Token',
          descEn: 'Paste the HTTP API Token you received from BotFather below:',
          descAr: 'انسخ رمز HTTP API Token الذي حصلت عليه والصقه هنا (لأغراض العرض فقط):',
          copyData: '7192837:AAH_EXAMPLE_TOKEN_xyz',
          labelEn: 'Your Bot Token',
          labelAr: 'رمز البوت الخاص بك'
        }
      ]
    }
  };

  const platform = platforms[type];
  if (!platform) return null;

  const currentStep = platform.steps[step - 1];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 ${isRtl ? 'rtl text-right' : 'ltr text-left'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#050B0E] border border-nexus-emerald/30 rounded-3xl p-6 md:p-8 max-w-xl w-full relative overflow-hidden"
      >
        <button onClick={onClose} className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} text-gray-400 hover:text-white z-10`}>
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className={`p-4 rounded-2xl ${platform.color}`}>
            {platform.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {isRtl ? platform.titleAr : platform.titleEn}
            </h3>
            <p className="text-sm text-gray-400">{platform.subtitle}</p>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center mb-8 relative z-10">
          {platform.steps.map((s, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > idx + 1 ? 'bg-nexus-emerald text-black' : step === idx + 1 ? 'bg-nexus-mint text-black shadow-[0_0_15px_rgba(0,255,157,0.4)]' : 'bg-gray-800 text-gray-500'}`}>
                  {step > idx + 1 ? <CheckCircle size={16} /> : idx + 1}
                </div>
                <span className={`text-[10px] mt-2 absolute w-20 text-center translate-y-8 ${step === idx + 1 ? 'text-nexus-mint font-bold' : 'text-gray-500'}`}>
                  {isRtl ? s.titleAr : s.titleEn}
                </span>
              </div>
              {idx < platform.steps.length - 1 && (
                <div className={`flex-1 h-[2px] mx-2 ${step > idx + 1 ? 'bg-nexus-emerald' : 'bg-gray-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mb-12 mt-12 relative z-10 min-h-[160px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              <h4 className="text-xl font-bold text-white mb-2">{isRtl ? currentStep.titleAr : currentStep.titleEn}</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {isRtl ? currentStep.descAr : currentStep.descEn}
              </p>

              {currentStep.customContent && type === 'wa' && (
                <div className="flex flex-col items-center justify-center py-4">
                  {waStatus === 'needs_qr' && waQrCode ? (
                    <div className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(0,255,157,0.2)]">
                      <QRCodeSVG value={waQrCode} size={200} />
                    </div>
                  ) : waStatus === 'ready' ? (
                    <div className="flex flex-col items-center text-nexus-emerald">
                      <CheckCircle size={64} className="mb-4" />
                      <p className="text-xl font-bold">{isRtl ? 'تم الربط بنجاح!' : 'Connected Successfully!'}</p>
                    </div>
                  ) : waStatus === 'disconnected' ? (
                     <p className="text-red-400">{isRtl ? 'لا يوجد اتصال بالسيرفر الخلفي. الرجاء تشغيل السيرفر.' : 'No connection to local backend.'}</p>
                  ) : (
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-gray-700 h-10 w-10"></div>
                      <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-gray-700 rounded"></div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-gray-700 rounded col-span-2"></div>
                            <div className="h-2 bg-gray-700 rounded col-span-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep.copyData && (
                <div>
                  <label className="block text-xs text-nexus-mint uppercase font-bold mb-2">
                    {isRtl ? currentStep.labelAr : currentStep.labelEn}
                  </label>
                  <div className="flex items-center bg-black border border-white/10 rounded-xl p-3 relative group">
                    <code className="flex-1 text-sm text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
                      {currentStep.copyData}
                    </code>
                    <button 
                      onClick={() => handleCopy(currentStep.copyData, currentStep.labelEn)} 
                      className={`ml-2 p-2 rounded-lg transition-colors ${copied === currentStep.labelEn ? 'text-nexus-emerald bg-nexus-emerald/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                      {copied === currentStep.labelEn ? <CheckCircle size={18} /> : <Copy size={18} />}
                    </button>
                    {copied === currentStep.labelEn && (
                      <span className="absolute -top-8 right-0 text-xs bg-nexus-emerald text-black px-2 py-1 rounded font-bold">Copied!</span>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center relative z-10 pt-4 border-t border-white/10">
          <button
            onClick={() => setStep(prev => prev - 1)}
            disabled={step === 1}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl font-semibold transition-colors ${step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-white/10'}`}
          >
            {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {isRtl ? 'السابق' : 'Back'}
          </button>
          
          {step < platform.steps.length ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className={`flex items-center gap-1 px-6 py-2 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              {isRtl ? 'التالي' : 'Next'}
              {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          ) : (
            <button
              onClick={onConnect}
              className="px-6 py-2 bg-nexus-emerald text-black rounded-xl font-bold hover:bg-nexus-mint transition-colors shadow-[0_0_15px_rgba(0,255,157,0.3)]"
            >
              {isRtl ? 'إتمام الربط' : 'Finish Connection'}
            </button>
          )}
        </div>
        
        {/* Background glow based on platform color */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-5 blur-3xl pointer-events-none rounded-full ${platform.color.split(' ')[0]}`} />
      </motion.div>
    </div>
  );
}
