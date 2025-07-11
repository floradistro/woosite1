export type ProductType = 'flower' | 'edible' | 'vape' | 'wax' | 'moonwater' | 'subscriptions';

export type FilterType = 'all' | 'indica' | 'sativa' | 'hybrid';
export type VibeType = 'all' | 'relax' | 'energize' | 'balance';
export type SecondaryFilterType = 'all' | 'candy' | 'gas' | 'cake' | 'funk' | 'sherb' | 'gummies' | 'chocolates' | 'mints' | 'cookies' | 'caramels' | 'shatter' | 'budder' | 'sauce' | 'diamonds' | 'rosin' | 'citrus' | 'berry' | 'tropical' | 'herbal' | 'mint';

export interface ProductCollectionConfig {
  productType: ProductType;
  formats: {
    primary: string;
    secondary?: string;
  };
  pricing: {
    primary: Record<string, number>;
    secondary?: Record<string, number>;
  };
  filters: {
    secondaryFilterName: string;
    secondaryFilterOptions: SecondaryFilterType[];
  };
  content: {
    hero: {
      primary: { 
        title: string; 
        subtitle: string; 
        description: string;
        features?: string[];
        qualityBadges?: string[];
      };
      secondary?: { 
        title: string; 
        subtitle: string; 
        description: string;
        features?: string[];
        qualityBadges?: string[];
      };
    };
    qualitySection: {
      title: { primary: string; secondary?: string };
      subtitle: { primary: string; secondary?: string };
      description: { primary: string; secondary?: string };
      columns: Array<{
        title: { primary: string; secondary?: string };
        description: { primary: string; secondary?: string };
        color: string;
      }>;
      bottomStatement: {
        text: { primary: string; secondary?: string };
        highlight: { primary: string; secondary?: string };
        highlightColor: string;
      };
    };
    experienceSection: {
      title: string;
      subtitle: string;
      columns: Array<{
        title: string;
        highlight: string;
        highlightColor: string;
        description: { primary: string; secondary?: string };
      }>;
    };
  };
  defaultValues: {
    weight: { primary: string; secondary?: string };
    sortBy: string;
  };
  loadingText: string;
}

// Configuration for Flower/Pre-rolls
export const flowerConfig: ProductCollectionConfig = {
  productType: 'flower',
  formats: {
    primary: 'flower',
    secondary: 'preroll'
  },
  pricing: {
    primary: { '3.5g': 40, '7g': 70, '14g': 130, '28g': 240 }, // WEIGHT_PRICING
    secondary: { '1-pack': 15, '3-pack': 40, '5-pack': 60 } // PREROLL_PRICING
  },
  filters: {
    secondaryFilterName: 'nose',
    secondaryFilterOptions: ['all', 'candy', 'gas', 'cake', 'funk', 'sherb']
  },
  content: {
    hero: {
      primary: { 
        title: "Real Weed. Real Fast.",
        subtitle: "Premium THCA Flower",
        description: "Farm-direct cannabis delivered to your door. No middlemen, just fire.",
        features: ["20-30% THCa", "4.9★ Rated", "Same Day Ship"],
        qualityBadges: ["White Ash", "Soft Texture", "Strong Nose"]
      },
      secondary: {
        title: "Pre-Rolled Excellence.",
        subtitle: "Premium Pre-Rolls",
        description: "Hand-rolled from our premium flower. Fresh made, never pre-packed.",
        features: ["Hand-rolled", "Premium Flower", "Fresh Daily"],
        qualityBadges: ["No Shake", "Actual Flower", "Perfect Roll"]
      }
    },
    qualitySection: {
      title: { 
        primary: 'We Ship Fire.',
        secondary: 'Fresh Rolled. Made to Order.'
      },
      subtitle: {
        primary: 'Every strain is judged on impact.',
        secondary: 'Every pre-roll is rolled fresh from our premium flower.'
      },
      description: {
        primary: 'If it doesn\'t punch, it\'s gone. No second chances.',
        secondary: 'No shake. No trim. Just pure flower, rolled to perfection.'
      },
      columns: [
        {
          title: { primary: 'Direct Source Only', secondary: 'Made to Order' },
          description: { 
            primary: 'No white labels. No brokers. No warehouse swaps. We work direct—because trusting middlemen is how you end up with trash.',
            secondary: 'Every pre-roll is rolled fresh when you order. No pre-made inventory sitting around losing potency.'
          },
          color: 'amber'
        },
        {
          title: { primary: 'If It\'s Not Indoor, It\'s Not Even Considered', secondary: 'Premium Flower Only' },
          description: {
            primary: 'Outdoor doesn\'t make the cut—ever. No exceptions. No compromises. No conversation.',
            secondary: 'Same premium indoor flower we sell loose, just rolled for your convenience. No shake, no trim, no filler.'
          },
          color: 'emerald'
        },
        {
          title: { primary: 'We Smoke Everything Before You Do', secondary: 'Hand-Rolled Precision' },
          description: {
            primary: 'No guessing. No hype strain bias. If it didn\'t pass through our lungs, it doesn\'t pass to the shelf.',
            secondary: 'Each pre-roll is hand-inspected and perfectly packed. Consistent burn, full flavor, every time.'
          },
          color: 'blue'
        }
      ],
      bottomStatement: {
        text: { 
          primary: 'You won\'t find old weed in shiny bags here.',
          secondary: 'You won\'t find stale pre-rolls in plastic tubes here.'
        },
        highlight: {
          primary: 'You get it fresh, loud, and exactly how we smoke it.',
          secondary: 'You get it fresh-rolled, loud, and ready to light.'
        },
        highlightColor: 'emerald'
      }
    },
    experienceSection: {
      title: "Orders Don't Sit. Neither Do We.",
      subtitle: "Freshness in Motion.",
      columns: [
        {
          title: "Same-Day",
          highlight: "Shipouts",
          highlightColor: "blue",
          description: { primary: "Orders placed by 2PM ship within hours." }
        },
        {
          title: "No",
          highlight: "Prepacked Bullsh*t.",
          highlightColor: "green",
          description: { 
            primary: "Every order is sealed fresh — right after it's placed.",
            secondary: "We don't pre-roll. Every pre-roll is made fresh — right after it's ordered."
          }
        },
        {
          title: "Local?",
          highlight: "Even Faster.",
          highlightColor: "purple",
          description: { primary: "Most local orders drop next day. Many land same day." }
        }
      ]
    }
  },
  defaultValues: {
    weight: { primary: '3.5g', secondary: '1-pack' },
    sortBy: 'featured'
  },
  loadingText: 'Loading flower collection...'
};

// Configuration for Edibles
export const edibleConfig: ProductCollectionConfig = {
  productType: 'edible',
  formats: {
    primary: 'single',
    secondary: 'bulk'
  },
  pricing: {
    primary: { '1-piece': 8, '3-piece': 22, '5-piece': 35 }, // SINGLE_PRICING
    secondary: { '10-pack': 60, '20-pack': 110, '50-pack': 250 } // PACK_PRICING
  },
  filters: {
    secondaryFilterName: 'type',
    secondaryFilterOptions: ['all', 'gummies', 'chocolates', 'mints', 'cookies', 'caramels']
  },
  content: {
    hero: {
      primary: {
        title: "Taste The High.",
        subtitle: "Premium Cannabis Edibles",
        description: "Artisan-crafted edibles with precise dosing. Delicious and consistent.",
        features: ["Artisan-crafted", "Precise dosing"],
        qualityBadges: ["Premium", "Delicious"]
      },
      secondary: {
        title: "Stock Up. Save More.",
        subtitle: "Bulk Edible Packs",
        description: "Buy in bulk and save. Perfect for regular users and sharing.",
        features: ["Buy in bulk", "Save"],
        qualityBadges: ["Bulk", "Save"]
      }
    },
    qualitySection: {
      title: {
        primary: 'Precision Dosed. Deliciously Crafted.',
        secondary: 'Stock Up. Save More.'
      },
      subtitle: {
        primary: 'Every edible is precisely dosed for consistent, reliable effects.',
        secondary: 'Bulk packs for those who know what works and want to save.'
      },
      description: {
        primary: 'No guessing. No surprises. Just perfect portions every time.',
        secondary: 'Buy more, save more. Perfect for regular users and sharing.'
      },
      columns: [
        {
          title: { primary: 'Artisan Quality', secondary: 'Value Pricing' },
          description: {
            primary: 'Small-batch production with premium ingredients. Real fruit, real chocolate, real flavor—no artificial nonsense.',
            secondary: 'The more you buy, the more you save. Stock up on your favorites without breaking the bank.'
          },
          color: 'pink'
        },
        {
          title: { primary: 'Lab-Tested Consistency', secondary: 'Freshness Guaranteed' },
          description: {
            primary: 'Every batch tested for potency and purity. Consistent 10mg doses in every piece, guaranteed.',
            secondary: 'Individually wrapped for freshness. Long shelf life means you can stock up worry-free.'
          },
          color: 'orange'
        },
        {
          title: { primary: 'Onset You Can Trust', secondary: 'Perfect for Sharing' },
          description: {
            primary: 'Feel it in 30-60 minutes. Effects last 4-6 hours. Predictable, reliable, enjoyable.',
            secondary: 'Great for parties, events, or just having plenty on hand. Share the experience.'
          },
          color: 'purple'
        }
      ],
      bottomStatement: {
        text: {
          primary: 'You won\'t find chalky, bitter edibles here.',
          secondary: 'You won\'t find overpriced single servings here.'
        },
        highlight: {
          primary: 'You get delicious, precisely-dosed treats that actually taste good.',
          secondary: 'You get bulk value without compromising on quality.'
        },
        highlightColor: 'pink'
      }
    },
    experienceSection: {
      title: "Fresh Made. Fast Delivered.",
      subtitle: "Sweetness in Motion.",
      columns: [
        {
          title: "Same-Day",
          highlight: "Processing",
          highlightColor: "pink",
          description: { primary: "Orders placed by 2PM ship within hours." }
        },
        {
          title: "Freshness",
          highlight: "Sealed.",
          highlightColor: "orange",
          description: {
            primary: "Every edible individually wrapped for maximum freshness.",
            secondary: "Bulk packs sealed tight to maintain quality and potency."
          }
        },
        {
          title: "Local?",
          highlight: "Sweet & Fast.",
          highlightColor: "purple",
          description: { primary: "Most local orders arrive next day, fresh as can be." }
        }
      ]
    }
  },
  defaultValues: {
    weight: { primary: '1-piece', secondary: '10-pack' },
    sortBy: 'featured'
  },
  loadingText: 'Loading edible collection...'
};

// Configuration for Vapes
export const vapeConfig: ProductCollectionConfig = {
  productType: 'vape',
  formats: {
    primary: 'cartridge'
  },
  pricing: {
    primary: { '0.5g': 35, '1g': 60 } // WEIGHT_PRICING for vapes
  },
  filters: {
    secondaryFilterName: 'nose',
    secondaryFilterOptions: ['all', 'candy', 'gas', 'cake', 'funk', 'sherb']
  },
  content: {
    hero: {
      primary: {
        title: "Clean Hits. Pure Potency.",
        subtitle: "Premium Cannabis Vapes",
        description: "Lab-tested cartridges with strain-specific profiles. No cutting agents.",
        features: ["Lab-tested", "Strain-specific profiles"],
        qualityBadges: ["Premium", "Pure potency"]
      }
    },
    qualitySection: {
      title: {
        primary: 'Premium Oil. Pure Potency.'
      },
      subtitle: {
        primary: 'Every cartridge is crafted for maximum impact.'
      },
      description: {
        primary: 'If it doesn\'t hit clean, it\'s out. No compromises.'
      },
      columns: [
        {
          title: { primary: 'Lab-Tested Excellence' },
          description: {
            primary: 'No mystery oils. No cutting agents. Every batch tested for purity and potency—because your lungs deserve transparency.'
          },
          color: 'amber'
        },
        {
          title: { primary: 'Premium Hardware Only' },
          description: {
            primary: 'Ceramic coils. Glass tanks. No cheap metals. Hardware that respects the oil inside.'
          },
          color: 'emerald'
        },
        {
          title: { primary: 'Strain-Specific Profiles' },
          description: {
            primary: 'Real terpenes from real strains. No fake flavors. If it says Blue Dream, it tastes like Blue Dream.'
          },
          color: 'blue'
        }
      ],
      bottomStatement: {
        text: {
          primary: 'You won\'t find hotdog water in fancy packaging here.'
        },
        highlight: {
          primary: 'You get premium oil, clean hits, and verified potency.'
        },
        highlightColor: 'emerald'
      }
    },
    experienceSection: {
      title: "Fresh Stock. Fast Delivery.",
      subtitle: "Quality in Motion.",
      columns: [
        {
          title: "Same-Day",
          highlight: "Processing",
          highlightColor: "blue",
          description: { primary: "Orders placed by 2PM ship within hours." }
        },
        {
          title: "Fresh",
          highlight: "Inventory Only.",
          highlightColor: "green",
          description: {
            primary: "Every cartridge is batch-dated and rotation-managed."
          }
        },
        {
          title: "Local?",
          highlight: "Lightning Fast.",
          highlightColor: "purple",
          description: { primary: "Most local orders arrive next day. Many land same day." }
        }
      ]
    }
  },
  defaultValues: {
    weight: { primary: '0.5g' },
    sortBy: 'featured'
  },
  loadingText: 'Loading vape collection...'
};

// Configuration for Wax/Concentrates
export const waxConfig: ProductCollectionConfig = {
  productType: 'wax',
  formats: {
    primary: 'wax',
    secondary: 'live-resin'
  },
  pricing: {
    primary: { '1g': 45, '2g': 85, '3.5g': 150 }, // WEIGHT_PRICING for wax
    secondary: { '0.5g': 30, '1g': 55, '2g': 100 } // GRAM_PRICING for live resin
  },
  filters: {
    secondaryFilterName: 'texture',
    secondaryFilterOptions: ['all', 'shatter', 'budder', 'sauce', 'diamonds', 'rosin']
  },
  content: {
    hero: {
      primary: {
        title: "Dab Different.",
        subtitle: "Premium Cannabis Concentrates",
        description: "Solventless extracts and premium concentrates. Pure potency, clean melts.",
        features: ["Solventless", "Pure potency"],
        qualityBadges: ["Premium", "Clean melts"]
      },
      secondary: {
        title: "Terps Preserved.",
        subtitle: "Live Resin Collection",
        description: "Flash-frozen at harvest for maximum terpene preservation.",
        features: ["Flash-frozen", "Maximum terpene preservation"],
        qualityBadges: ["Fresh", "Terps preserved"]
      }
    },
    qualitySection: {
      title: {
        primary: 'Pure Potency. Concentrated Excellence.',
        secondary: 'Fresh Frozen. Maximum Terps.'
      },
      subtitle: {
        primary: 'Every concentrate is crafted for maximum potency and flavor.',
        secondary: 'Live resin captured at peak freshness for unmatched terpene profiles.'
      },
      description: {
        primary: 'If it doesn\'t dab clean, it\'s gone. No residue, no compromise.',
        secondary: 'Flash frozen at harvest. Extracted with precision. Terps preserved perfectly.'
      },
      columns: [
        {
          title: { primary: 'Solventless Excellence', secondary: 'Fresh Frozen Perfection' },
          description: {
            primary: 'No butane. No propane. Just pure extraction methods that preserve the plant\'s essence without compromise.',
            secondary: 'Harvested at peak ripeness and flash frozen within hours. No drying, no curing—just pure, fresh terpenes.'
          },
          color: 'amber'
        },
        {
          title: { primary: 'Lab-Tested Purity', secondary: 'Terpene Preservation' },
          description: {
            primary: 'Every batch tested for potency, purity, and residuals. Clean dabs only—your lungs will thank you.',
            secondary: 'Low-temp extraction preserves the full spectrum of terpenes. Taste the strain, not the process.'
          },
          color: 'emerald'
        },
        {
          title: { primary: 'Consistency Matters', secondary: 'Strain-Specific Profiles' },
          description: {
            primary: 'From shatter to sauce, every texture is perfected. Stable at room temp, melts clean on the nail.',
            secondary: 'Each batch captures the unique profile of its source strain. Real cannabis flavors, amplified.'
          },
          color: 'blue'
        }
      ],
      bottomStatement: {
        text: {
          primary: 'You won\'t find dark, burnt concentrates here.',
          secondary: 'You won\'t find dried-out, flavorless extracts here.'
        },
        highlight: {
          primary: 'You get golden, clean-melting concentrates that hit pure.',
          secondary: 'You get terp-rich, fresh-frozen excellence in every dab.'
        },
        highlightColor: 'emerald'
      }
    },
    experienceSection: {
      title: "Extracted Fresh. Delivered Fast.",
      subtitle: "Potency in Motion.",
      columns: [
        {
          title: "Same-Day",
          highlight: "Processing",
          highlightColor: "blue",
          description: { primary: "Orders placed by 2PM ship within hours." }
        },
        {
          title: "Cold-Chain",
          highlight: "Preserved.",
          highlightColor: "green",
          description: {
            primary: "Every concentrate stored and shipped at optimal temps.",
            secondary: "Live resin kept cold from extraction to your door."
          }
        },
        {
          title: "Local?",
          highlight: "Lightning Fast.",
          highlightColor: "purple",
          description: { primary: "Most local orders drop next day. Many land same day." }
        }
      ]
    }
  },
  defaultValues: {
    weight: { primary: '1g', secondary: '0.5g' },
    sortBy: 'featured'
  },
  loadingText: 'Loading concentrate collection...'
};

// Configuration for Moonwater
export const moonwaterConfig: ProductCollectionConfig = {
  productType: 'moonwater',
  formats: {
    primary: 'bottle',
    secondary: 'pack'
  },
  pricing: {
    primary: { '1-bottle': 12, '2-bottle': 22, '3-bottle': 30 }, // BOTTLE_PRICING
    secondary: { '4-pack': 40, '8-pack': 75, '12-pack': 105 } // PACK_PRICING
  },
  filters: {
    secondaryFilterName: 'flavor',
    secondaryFilterOptions: ['all', 'citrus', 'berry', 'tropical', 'herbal', 'mint']
  },
  content: {
    hero: {
      primary: {
        title: "Liquid Bliss.",
        subtitle: "Cannabis-Infused Beverages",
        description: "Nano-enhanced THC beverages. Fast-acting, refreshing, precisely dosed.",
        features: ["Nano-enhanced", "Fast-acting"],
        qualityBadges: ["THC", "Fast-acting"]
      },
      secondary: {
        title: "Hydrate & Elevate.",
        subtitle: "Moonwater Multi-Packs",
        description: "Stock up on your favorite flavors. Perfect for sharing or keeping chilled.",
        features: ["Stock up", "Perfect for sharing"],
        qualityBadges: ["Multi-packs", "Perfect for sharing"]
      }
    },
    qualitySection: {
      title: {
        primary: 'Liquid Elevation. Pure Hydration.',
        secondary: 'Stock Up. Stay Lifted.'
      },
      subtitle: {
        primary: 'Every bottle is crafted for smooth effects and incredible taste.',
        secondary: 'Multi-packs for those who know what they like and want more of it.'
      },
      description: {
        primary: 'No artificial flavors. No synthetic cannabinoids. Just pure, natural bliss.',
        secondary: 'Save more when you buy more. Perfect for sharing or stocking up.'
      },
      columns: [
        {
          title: { primary: 'Nano-Enhanced Absorption', secondary: 'Bulk Savings' },
          description: {
            primary: 'Advanced nano-emulsion technology for faster onset and better bioavailability. Feel it in minutes, not hours.',
            secondary: 'The more you buy, the more you save. Stock up on your favorites and never run dry.'
          },
          color: 'blue'
        },
        {
          title: { primary: 'All-Natural Ingredients', secondary: 'Party-Ready Packs' },
          description: {
            primary: 'Real fruit extracts. Natural terpenes. No artificial anything. Just clean, refreshing cannabis beverages.',
            secondary: 'Perfect for gatherings, events, or just keeping your fridge stocked. Shareable sizes for any occasion.'
          },
          color: 'purple'
        },
        {
          title: { primary: 'Precisely Dosed', secondary: 'Mix & Match Flavors' },
          description: {
            primary: 'Consistent 10mg THC per bottle. No guessing, no surprises. Just reliable, repeatable effects every time.',
            secondary: 'Build your own variety pack. Try different flavors and effects to find your perfect rotation.'
          },
          color: 'cyan'
        }
      ],
      bottomStatement: {
        text: {
          primary: 'You won\'t find chalky, artificial drinks here.',
          secondary: 'You won\'t find overpriced singles here.'
        },
        highlight: {
          primary: 'You get smooth, delicious cannabis beverages that actually taste good.',
          secondary: 'You get value packs that make sense for your lifestyle.'
        },
        highlightColor: 'blue'
      }
    },
    experienceSection: {
      title: "Cold-Shipped. Always Fresh.",
      subtitle: "Refreshment in Motion.",
      columns: [
        {
          title: "Same-Day",
          highlight: "Cold-Pack",
          highlightColor: "blue",
          description: { primary: "Orders placed by 2PM ship cold within hours." }
        },
        {
          title: "Temperature",
          highlight: "Controlled.",
          highlightColor: "purple",
          description: {
            primary: "Every bottle ships with ice packs to maintain freshness.",
            secondary: "Multi-packs shipped in insulated packaging for perfect arrival."
          }
        },
        {
          title: "Local?",
          highlight: "Ice Cold.",
          highlightColor: "cyan",
          description: { primary: "Most local orders arrive next day, perfectly chilled." }
        }
      ]
    }
  },
  defaultValues: {
    weight: { primary: '1-bottle', secondary: '4-pack' },
    sortBy: 'featured'
  },
  loadingText: 'Loading moonwater collection...'
};

// Export all configurations
export const productConfigs: Record<ProductType, ProductCollectionConfig> = {
  flower: flowerConfig,
  edible: edibleConfig,
  vape: vapeConfig,
  wax: waxConfig,
  moonwater: moonwaterConfig,
  subscriptions: flowerConfig // Using flower config as base for subscriptions
}; 