import React from 'react';

const SchemaMarkup = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ProposliGo",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "description": "AI-powered freelance proposal generator that helps freelancers win more projects.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "120"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default SchemaMarkup;
