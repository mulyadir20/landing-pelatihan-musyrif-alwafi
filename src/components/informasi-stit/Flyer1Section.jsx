import './Flyer1Section.css';

const PROFILE_LULUSAN = [
  { label: '1', value: 'PENGELOLA PENDIDIKAN', desc: 'Mencetak sarjana pendidikan yang ahli mengelola lembaga pendidikan islam di berbagai jenjang. Lulusan kompeten mengatur kurikulum, SDM, keuangan, humas hingga sistem informasi secara profesional, inovatif dan berbasis teknologi dengan jiwa kepemimpinan serta kewirausahaan yang berlandaskan Al-Qur\'an dan Hadits.' },
  { label: '2', value: 'PENELITI PEMULA', desc: 'Mencetak sarjana pendidikan yang ahli meneliti bidang Manajemen Pendidikan ISlam (MPI) secara objektif dan berbasis data. Lulusan mampu memanfaatkan teknologi untuk menganalisis masalah dan menghasilkan inovasi peningkatan mutu lembaga, berlandaskan integritas akademik serta nilai islam.' },
  { label: '3', value: 'KONSULTAN PEMULA', desc: 'Menjadi pengembang lembaga pendidikan islam yang kompeten menganalisis, merencanakan dan mengevaluasi program. Lulusan terampil merumuskan solusi berbasis data untuk SDM, kurikulum, hingga transformasi digital, dengan dukungan skill kepemimpinan, komunikasi dan kewirausahaan yang berlandaskan nilai-nilai keislaman.' },
];

export default function Flyer1Section() {
  return (
    <section id="stit-section-1" className="f1-section">
      <div className="f1-section__header">
        <div className="container f1-section__header-inner">
          <p className="f1-section__eyebrow">SEKOLAH TINGGI ILMU TARBIYAH AL WAFI BOGOR</p>
          <h1 className="f1-section__title">PENERIMAAN MAHASISWA BARU</h1>
          <p className="f1-section__year">TAHUN AKADEMIK 2026/2027</p>
          <p className="f1-section__tagline">Mencetak Generasi Pendidik yang Berilmu, Berakhlak dan Siap Mengabdi Untuk Umat</p>
          <div className="f1-section__divider" />
        </div>
      </div>

      <div className="container f1-section__content">
        <div className="f1-panel f1-panel--contact">
          <h2 className="f1-panel__title">PROFIL LULUSAN</h2>
          <div className="f1-contact-grid">
            {PROFILE_LULUSAN.map((item) => (
              <article key={item.label} className="f1-contact-card">
                <p className="f1-contact-card__label">{item.label}</p>
                <p className="f1-contact-card__value">{item.value}</p>
                <p className="f1-contact-card__desc">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
