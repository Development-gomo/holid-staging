// const nextConfig = {
//   images: {
//     domains: ['gomostaging.com'],
//   },
// };

// export default nextConfig;

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
