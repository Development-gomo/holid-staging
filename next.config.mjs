const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gomostaging.com',
        pathname: '/**',  // Allows any path under gomostaging.com
      },
    ],
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "gomostaging.com",
//         pathname: "/holid/wp-content/uploads/**",
//       },
//     ],
//   },
// };

// export default nextConfig;