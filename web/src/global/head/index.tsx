type Props = {
  /** The title of the page */
  title?: null | string;
  /** The description of the page */
  description: string;
  /** Whether to disable SEO tags */
  SEODisabled?: boolean;
  /** keywords for the page */
  keyWords?: string;
};

const appTitle = "LennertVG";
const defaultKeyWords =
  "Portfolio, Lennert Van Geert, Web Developer, Frontend Developer, Backend Developer, Full Stack Developer, React, Node.js, JavaScript, TypeScript, Web Development";
const author = "Lennert Van Geert";

/**
 * Head component
 * @param {Props} title - The title of the page
 * @param {string} description - The description of the page
 * @param {boolean} SEODisabled - Whether to disable SEO tags
 * @param {string} keyWords - Keywords for the page
 * @description This component sets the document head with SEO metadata and is placed on every unique page.
 * @returns {JSX.Element}
 */
const Head = ({
  title,
  description,
  SEODisabled = false,
  keyWords = defaultKeyWords,
}: Props) => {
  const pageTitle = title ? `${title} | ${appTitle}` : appTitle;

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />

      {!SEODisabled && (
        <>
          <meta name="keywords" content={keyWords} />
          <meta name="author" content={author} />
          <meta name="robots" content="index, follow" />

          {/* Open Graph */}
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={window.location.href} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebPage",
                name: pageTitle,
                description,
                url: window.location.href,
              }),
            }}
          />
        </>
      )}
    </>
  );
};

export default Head;
