require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Package, Category, Content, Episode } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('[seed] Connected & synced MySQL tables.');

    // 1. Users
    const adminHash = await bcrypt.hash('admin1234', 10);
    const demoHash = await bcrypt.hash('demo1234', 10);

    await User.findOrCreate({
      where: { email: 'admin@flipss.id' },
      defaults: { name: 'Flipss Admin', passwordHash: adminHash, role: 'admin' },
    });
    await User.findOrCreate({
      where: { email: 'demo@flipss.id' },
      defaults: { name: 'Demo Viewer', passwordHash: demoHash, role: 'user' },
    });

    // 2. Packages (Plans)
    const packagesData = [
      {
        name: 'Mobile',
        slug: 'mobile',
        tagline: 'Stream on your smartphone & tablet anywhere',
        description: 'Affordable cinema in your pocket with 720p HD playback on 1 mobile device.',
        priceMonthly: 54000,
        priceYearly: 540000,
        currency: 'IDR',
        resolution: '720p HD',
        maxDevices: 1,
        downloadsAllowed: 1,
        adsFree: true,
        tierLevel: 1,
        isPopular: false,
        features: [
          '720p HD video quality',
          'Watch on 1 phone or tablet',
          'Unlimited movies & Flipss Originals',
          'Download on 1 device',
          'Ad-free viewing',
        ],
      },
      {
        name: 'Basic',
        slug: 'basic',
        tagline: 'Great for solo viewers on TV or laptop',
        description: 'Crisp 1080p Full HD streaming on any screen including Smart TV, laptop, or phone.',
        priceMonthly: 65000,
        priceYearly: 650000,
        currency: 'IDR',
        resolution: '1080p Full HD',
        maxDevices: 1,
        downloadsAllowed: 2,
        adsFree: true,
        tierLevel: 2,
        isPopular: false,
        features: [
          '1080p Full HD video quality',
          'Watch on TV, laptop, phone & tablet',
          '1 simultaneous stream',
          'Download on 2 devices',
          'Ad-free viewing',
        ],
      },
      {
        name: 'Standard',
        slug: 'standard',
        tagline: 'Perfect for couples & small households',
        description: 'Full HD streaming on 2 devices at once with surround sound and offline downloads.',
        priceMonthly: 120000,
        priceYearly: 1200000,
        currency: 'IDR',
        resolution: '1080p Full HD',
        maxDevices: 2,
        downloadsAllowed: 4,
        adsFree: true,
        tierLevel: 3,
        isPopular: true,
        features: [
          '1080p Full HD + Dolby Digital',
          'Watch on 2 devices simultaneously',
          'All TV, web & mobile platforms',
          'Download on 4 devices',
          'Early access to Flipss Originals',
        ],
      },
      {
        name: 'Ultra 4K',
        slug: 'ultra-4k',
        tagline: 'Flagship theater experience at home',
        description: 'True 4K Ultra HD + HDR10 with Spatial Audio on up to 4 screens simultaneously.',
        priceMonthly: 186000,
        priceYearly: 1860000,
        currency: 'IDR',
        resolution: '4K Ultra HD + HDR',
        maxDevices: 4,
        downloadsAllowed: 6,
        adsFree: true,
        tierLevel: 4,
        isPopular: false,
        features: [
          '4K Ultra HD + HDR10 & Dolby Vision',
          'Flipss Spatial Audio',
          'Watch on 4 devices simultaneously',
          'Download on 6 devices',
          'VIP premiere access & zero ads',
        ],
      },
    ];

    for (const pkg of packagesData) {
      await Package.findOrCreate({ where: { slug: pkg.slug }, defaults: pkg });
    }

    // 3. Categories
    const categoriesData = [
      { name: 'Action & Thriller', slug: 'action-thriller', description: 'High-octane chases and suspense.' },
      { name: 'Sci-Fi & Cyberpunk', slug: 'sci-fi-cyberpunk', description: 'Futuristic worlds and mind-bending tech.' },
      { name: 'Indonesian Originals', slug: 'indonesian-originals', description: 'Exclusive Nusantara stories crafted for Flipss.id.' },
      { name: 'Drama & Noir', slug: 'drama-noir', description: 'Character-driven prestige cinema.' },
      { name: 'Horror & Mystery', slug: 'horror-mystery', description: 'Spine-chilling folklore and supernatural mysteries.' },
    ];

    const categoryMap = {};
    for (const cat of categoriesData) {
      const [record] = await Category.findOrCreate({ where: { slug: cat.slug }, defaults: cat });
      categoryMap[cat.slug] = record.id;
    }

    // 4. Contents
    const contentsData = [
      {
        title: 'Jakarta Noir: 2034',
        slug: 'jakarta-noir-2034',
        synopsis:
          'In rain-drenched megacity Jakarta, a disgraced cyber-crimes investigator uncovers a black-market memory cartel reaching the highest towers of Sudirman.',
        type: 'series',
        releaseYear: 2026,
        durationMinutes: 54,
        maturityRating: '18+',
        imdbRating: 9.1,
        genres: ['Sci-Fi', 'Neo-Noir', 'Thriller'],
        cast: ['Reza Rahadian', 'Tara Basro', 'Joe Taslim'],
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        isFeatured: true,
        isTrending: true,
        isOriginal: true,
        requiredPackageTier: 1,
        categoryId: categoryMap['sci-fi-cyberpunk'],
      },
      {
        title: 'Crimson Archipelago',
        slug: 'crimson-archipelago',
        synopsis:
          'When an ancient volcanic signal awakens across the Banda Sea, a marine archaeologist and a naval captain race against a shadow syndicate.',
        type: 'movie',
        releaseYear: 2026,
        durationMinutes: 132,
        maturityRating: '16+',
        imdbRating: 8.7,
        genres: ['Action', 'Adventure', 'Mystery'],
        cast: ['Iko Uwais', 'Pevita Pearce', 'Yayan Ruhian'],
        posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=600&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        isFeatured: true,
        isTrending: true,
        isOriginal: true,
        requiredPackageTier: 1,
        categoryId: categoryMap['action-thriller'],
      },
      {
        title: 'Midnight Kereta',
        slug: 'midnight-kereta',
        synopsis:
          'A night express train from Yogyakarta to Surabaya passes through a forgotten tunnel where passengers begin reliving their darkest secrets.',
        type: 'series',
        releaseYear: 2025,
        durationMinutes: 46,
        maturityRating: '18+',
        imdbRating: 8.5,
        genres: ['Horror', 'Supernatural', 'Mystery'],
        cast: ['Asmara Abigail', 'Marthino Lio'],
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
        trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        isFeatured: false,
        isTrending: true,
        isOriginal: true,
        requiredPackageTier: 2,
        categoryId: categoryMap['horror-mystery'],
      },
    ];

    for (const item of contentsData) {
      const [content] = await Content.findOrCreate({ where: { slug: item.slug }, defaults: item });
      if (item.type === 'series') {
        await Episode.findOrCreate({
          where: { contentId: content.id, seasonNumber: 1, episodeNumber: 1 },
          defaults: {
            title: 'Episode 1: Red Signal',
            synopsis: 'The first transmission breaks through the static.',
            durationMinutes: item.durationMinutes,
            thumbnailUrl: item.backdropUrl,
            videoUrl: item.videoUrl,
          },
        });
        await Episode.findOrCreate({
          where: { contentId: content.id, seasonNumber: 1, episodeNumber: 2 },
          defaults: {
            title: 'Episode 2: Ghost Protocol',
            synopsis: 'Allies turn into suspects under neon skies.',
            durationMinutes: item.durationMinutes - 2,
            thumbnailUrl: item.backdropUrl,
            videoUrl: item.videoUrl,
          },
        });
      }
    }

    console.log('[seed] Flipss.id database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[seed] Failed:', err.message);
    process.exit(1);
  }
};

seed();
