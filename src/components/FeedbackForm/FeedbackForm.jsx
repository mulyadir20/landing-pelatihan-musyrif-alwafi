import { useRef, useState } from 'react';
import { Send, AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import siteConfig from '../../config/siteConfig';
import SectionHeading from '../ui/SectionHeading';
import './FeedbackForm.css';

const INITIAL_VALUES = { name: '', email: '', category: '', message: '', website: '' };

/** Validasi formulir di sisi klien (server tetap memvalidasi ulang). */
function validate(values) {
  const errors = {};

  if (values.name.trim().length > 100) {
    errors.name = 'Nama terlalu panjang (maksimal 100 karakter).';
  }

  const email = values.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Format email belum benar, misalnya nama@domain.com.';
  } else if (email.length > 120) {
    errors.email = 'Email terlalu panjang (maksimal 120 karakter).';
  }

  if (!values.category) {
    errors.category = 'Pilih salah satu kategori masukan.';
  }

  const message = values.message.trim();
  if (!message) {
    errors.message = 'Tuliskan saran atau masukan Anda.';
  } else if (message.length < 10) {
    errors.message = 'Tulisan terlalu singkat (minimal 10 karakter).';
  } else if (message.length > 2000) {
    errors.message = 'Pesan terlalu panjang (maksimal 2000 karakter).';
  }

  return errors;
}

/**
 * Kirim masukan ke endpoint serverless.
 * Ganti fungsi ini bila ingin memakai layanan lain — cukup ubah satu tempat.
 */
async function submitFeedback(payload) {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  // Pastikan respons benar-benar JSON. Bila bukan (mis. SPA fallback di server
  // pengembangan), jangan pernah dianggap sebagai keberhasilan.
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let data = null;
  if (isJson) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok || !isJson) {
    const error = new Error(
      isJson ? data?.message ?? 'Permintaan gagal diproses.' : 'Endpoint formulir tidak ditemukan.'
    );
    error.code = isJson ? response.status : 404;
    throw error;
  }

  return data;
}

export default function FeedbackForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [notice, setNotice] = useState(null);
  const formRef = useRef(null);

  const isDev = import.meta.env.DEV;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    const next = validate({ ...values, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: next[name] }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'submitting') return;

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      setStatus('idle');
      setNotice({
        type: 'error',
        text: 'Beberapa isian belum benar. Periksa kembali kolom yang ditandai.',
      });
      const firstInvalid = formRef.current?.querySelector('[aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }

    setStatus('submitting');
    setNotice(null);

    try {
      await submitFeedback({
        name: values.name.trim() || undefined,
        email: values.email.trim() || undefined,
        category: values.category,
        message: values.message.trim(),
        website: values.website, // honeypot: harus kosong
      });

      setStatus('success');
      setValues(INITIAL_VALUES);
      setNotice({
        type: 'success',
        text: 'Masukan Anda berhasil diterima. Terima kasih atas kontribusinya.',
      });
      formRef.current?.reset();
    } catch (error) {
      setStatus('error');

      if (error.code === 503 || error.code === 501) {
        setNotice({
          type: 'warning',
          text:
            'Pengiriman masukan belum aktif. Penyimpanan backend belum dikonfigurasi oleh ' +
            'pengelola situs, sehingga masukan belum dapat diteruskan.',
        });
      } else if (error.code === 404) {
        setNotice({
          type: 'warning',
          text:
            'Endpoint formulir (/api/feedback) belum tersedia pada lingkungan ini, sehingga ' +
            'masukan belum terkirim. Formulir akan berfungsi setelah situs di-deploy beserta ' +
            'endpoint serverless-nya.',
        });
      } else if (isDev) {
        setNotice({
          type: 'warning',
          text:
            'Endpoint /api/feedback hanya tersedia saat deploy di Vercel. Jalankan `vercel dev` ' +
            'atau deploy proyek untuk menguji pengiriman formulir.',
        });
      } else {
        setNotice({
          type: 'error',
          text: `Masukan belum dapat dikirim. ${error.message ?? ''}`.trim(),
        });
      }
    }
  }

  return (
    <section className="section" id="saran-masukan" aria-labelledby="saran-title">
      <div className="container feedback">
        <div className="feedback__intro">
          <SectionHeading
            eyebrow="Komunikasi Terbuka"
            title="Saran & Masukan"
            description="Bantu kami meningkatkan kualitas pelatihan. Tuliskan saran, masukan, atau kendala yang Anda temui."
            id="saran-title"
          />

          <ul className="feedback__info" role="list">
            <li>
              <Info size={16} aria-hidden="true" />
              <span>
                Kolom <strong>Nama</strong> dan <strong>Email</strong> bersifat opsional, hanya
                diminta bila Anda ingin panitia dapat membalas langsung.
              </span>
            </li>
            <li>
              <Info size={16} aria-hidden="true" />
              <span>
                Pengiriman masukan akan aktif setelah backend penyimpanan dikonfigurasi oleh
                pengelola situs.
              </span>
            </li>
          </ul>
        </div>

        <form className="feedback__form" onSubmit={handleSubmit} noValidate ref={formRef}>
          {/* Honeypot anti-spam: dibiarkan kosong dan disembunyikan dari pengguna */}
          <div className="feedback__hp" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={handleChange}
            />
          </div>

          <div className="feedback__row">
            <div className="field">
              <label className="field__label" htmlFor="name">
                Nama <span className="field__optional">(opsional)</span>
              </label>
              <input
                className="field__input"
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Nama Anda"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={100}
                aria-invalid={errors.name ? 'true' : undefined}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p className="field__error" id="name-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="email">
                Email <span className="field__optional">(opsional)</span>
              </label>
              <input
                className="field__input"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nama@domain.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={120}
                aria-invalid={errors.email ? 'true' : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p className="field__error" id="email-error">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="category">
              Kategori masukan <span className="field__required">*</span>
            </label>
            <select
              className="field__input field__input--select"
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={errors.category ? 'true' : undefined}
              aria-describedby={errors.category ? 'category-error' : undefined}
            >
              <option value="">Pilih kategori…</option>
              {siteConfig.feedbackCategories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="field__error" id="category-error">
                {errors.category}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="message">
              Pesan atau saran <span className="field__required">*</span>
            </label>
            <textarea
              className="field__input field__input--textarea"
              id="message"
              name="message"
              rows={5}
              placeholder="Tuliskan saran atau masukan Anda…"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={2000}
              aria-invalid={errors.message ? 'true' : undefined}
              aria-describedby={errors.message ? 'message-error' : 'message-hint'}
            />
            {errors.message ? (
              <p className="field__error" id="message-error">
                {errors.message}
              </p>
            ) : (
              <p className="field__hint" id="message-hint">
                {values.message.length}/2000 karakter
              </p>
            )}
          </div>

          {notice && (
            <p
              className={`feedback__notice feedback__notice--${notice.type}`}
              role={notice.type === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {notice.type === 'success' ? (
                <CheckCircle2 size={18} aria-hidden="true" />
              ) : (
                <AlertCircle size={18} aria-hidden="true" />
              )}
              <span>{notice.text}</span>
            </p>
          )}

          <button className="btn btn--navy btn--block" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? (
              <>
                <Loader2 size={18} className="feedback__spinner" aria-hidden="true" />
                Mengirim…
              </>
            ) : (
              <>
                <Send size={18} aria-hidden="true" />
                Kirim Masukan
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
