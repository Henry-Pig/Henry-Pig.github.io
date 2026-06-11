/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/projects.html", destination: "/projects", permanent: true },
      { source: "/life.html", destination: "/life", permanent: true },
      { source: "/moments.html", destination: "/life/moments", permanent: true },
      { source: "/todo.html", destination: "/life/todo", permanent: true },
      { source: "/reading.html", destination: "/life/reading", permanent: true },
      { source: "/blog.html", destination: "/blog", permanent: true },
      {
        source: "/projects/dti-subgraph-attention.html",
        destination: "/projects/dti-subgraph-attention",
        permanent: true
      },
      {
        source: "/projects/basketball-reid.html",
        destination: "/projects/basketball-reid",
        permanent: true
      },
      {
        source: "/projects/convnextv2-lightlygrn.html",
        destination: "/projects/convnextv2-lightlygrn",
        permanent: true
      },
      {
        source: "/projects/densenet-caltech101.html",
        destination: "/projects/densenet-caltech101",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
