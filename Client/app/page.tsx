import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>AmpSkill - Assess, Train, and Develop Your Organization</title>
        <meta name="description" content="Build and deliver assessments, measure and improve skills." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>AmpSkill</div>
        <div className={styles.authButtons}>
          <Link href='/login'>
            <button className={styles.login}>Log in</button>
          </Link>
          <button className={styles.getStarted}>Get started</button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Assess, train, and develop your organization</h1>
            <p>We make it easy to build and deliver assessments, measure and improve skills, and understand your team's potential.</p>
            <div className={styles.heroButtons}>
              <button className={styles.signUp}>Sign up</button>
              <button className={styles.requestDemo}>Request demo</button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image src="/images/hero-image.png" alt="Hero Image" width={500} height={400} />
          </div>
        </section>

        <section className={styles.tabs}>
          <div className={styles.tab}>For Admins and Teachers</div>
          <div className={styles.tab}>For Students</div>
        </section>

        <section className={styles.features}>
          <div className={styles.featureCard}>
            <Image src="/images/feature-1.png" alt="Create and deliver assessments" width={150} height={150} />
            <h3>Create and deliver assessments</h3>
            <p>Use our authoring tools to create any type of assessment, from quizzes to coding challenges. Deliver them at scale with our flexible settings and proctoring options.</p>
          </div>

          <div className={styles.featureCard}>
            <Image src="/images/feature-2.png" alt="Understand and improve skills" width={150} height={150} />
            <h3>Understand and improve skills</h3>
            <p>Our AI technology automatically evaluates answers to open-ended questions, providing instant feedback. Use our skill models to measure and improve skills over time.</p>
          </div>

          <div className={styles.featureCard}>
            <Image src="/images/feature-3.png" alt="Measure and develop potential" width={150} height={150} />
            <h3>Measure and develop potential</h3>
            <p>Our skill models also predict performance on future assessments, so you can identify and develop high-potential talent.</p>
          </div>
        </section>
      </main>
    </>
  );
}
