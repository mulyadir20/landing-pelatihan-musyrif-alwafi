import './Flyer2Section.css';

const HIGHLIGHTS = [
  { label: 'VISI', value: 'Visi sekolah tinggi adalah: "Menjadi Perguruan Tinggi Terpercaya. Unggul, Berdaya Saing Global dalam mencetak. Tenaga Profesional dan Tenaga Pendidik yang Berkarakter Islami guna mendukung penyelenggaraan pendidikan yang berkualitas pada tahun 2045"' },
];

const MISI_ITEMS = [
  'Menyelenggarakan pendidikan tinggi yang unggul untuk menghasilkan tenaga pendidik profesional dan kompeten dalam pengelolaan pendidikan berlandaskan nilai-nilai islam.',
  'Mengembangkan ilmu dan pendidikan yang mengintegrasikan nilai-nilai keislaman, perkembangan teknologi dan keilmuan modern.',
  'Menghasilkan lulusan yang terpercaya, berkarakter islami, inovatif, adaptif dan mampu memberikan solusi terhadap berbagai permasalahan pendidikan pada tingkat nasional dan global.',
  'Mengembangkan budaya akademik yang mendukung pelaksanaan penelitian dan inovasi dalam bidang pendidikan islam berbasis teknologi.',
  'Menyelenggarakan pengabdian kepada masyarakat yang berorientasi pada pemberdayaan masyarakat dan peningkatan mutu pendidikan islam.',
];

export default function Flyer2Section() {
  return (
    <section id="stit-section-2" className="f2-section">
      <div className="f2-section__hero">
        <div className="container f2-section__hero-inner">
          <div className="f2-section__badge">STIT AL WAFI BOGOR</div>
          <h2 className="f2-section__title">TENTANG KAMI</h2>
          <p className="f2-section__desc">
            Sekolah Tinggi Ilmu Tarbiyah (STIT) Al Wafi adalah lembaga pendidikan tinggi yang berfokus pada pengembangan
            ilmu pendidikan islam. Prodi manajemen Pendidikan Islam Sekolah Tinggi Ilmu Tarbiyah Al Wafi Bogr
            Terakreditasi LAMDIK Nomor : 006058 Berdasarkan keputusan LAMDIK (Lembaga Akreditasi Mandiri
            Kependidikan) No.1127/sk/LAMDIK/ak-PSB/s/VI/2026. STIT Al Wafi bertujuan untuk mencetak lulusan yang
            memiliki kompetensi dalam bidang tarbiyah, khususnya pendidikan islam, dengan standar akademis yang sesuai
            dengan kebutuhan masyarakat modern.
          </p>
        </div>
      </div>

      <div className="container f2-section__content">
        <div className="f2-content__grid">
          <div className="f2-content__left">
            <div className="f2-visi-misi">
              {HIGHLIGHTS.map((item) => (
                <article key={item.label} className={`f2-card f2-card--highlight ${item.label === 'VISI' ? 'f2-card--visi' : ''}`}>
                  <span className="f2-card__label">{item.label}</span>
                  <p className="f2-card__text">{item.value}</p>
                </article>
              ))}
            </div>

            <article className="f2-card f2-card--highlight f2-card--misi">
              <span className="f2-card__label">MISI</span>
              <ol className="f2-misi__list">
                {MISI_ITEMS.map((item, index) => (
                  <li key={index} className="f2-misi__item">
                    <span className="f2-misi__num">{index + 1}</span>
                    <p className="f2-misi__text">{item}</p>
                  </li>
                ))}
              </ol>
            </article>
          </div>
          <div className="f2-content__right">
            <figure className="f2-photo__figure">
              <img
                src="/images/informasi-stit/Flyer-5.png"
                alt="Flyer 5 STIT Al Wafi Bogor"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/images/flyer-musyrif.webp';
                }}
              />
            </figure>
          </div>
        </div>


      </div>
    </section>
  );
}
