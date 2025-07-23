export type StoreItem = {
  id: number;
  type: 'store' | 'cta';
  name?: string;
  address?: string;
  city?: string;
  image?: string;
  hours?: string;
  gallery?: string[];
};

export type ProductItem = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  route: string;
};

export const products: ProductItem[] = [
  { id: 1, title: 'Flower', description: 'Premium indoor flower. Hand-trimmed, properly cured, and tested for potency. No outdoor, no trim, just fire buds.', price: 0, image: '/categories/FLOWER.png', category: 'flower', route: '/flower' },
  { id: 2, title: 'Pre-roll', description: 'Any of our flower strains, rolled fresh to order. Pick your strain, we roll it tight. Same premium flower, zero prep.', price: 0, image: '/categories/PRE ROLL.png', category: 'pre-roll', route: '/pre-roll' },
  { id: 3, title: 'Vape', description: 'Solventless liquid diamonds with real cannabis terpenes. No distillate, no fake flavors. Pure concentrate and natural terps.', price: 0, image: '/categories/VAPE.png', category: 'vape', route: '/vape' },
  { id: 4, title: 'Concentrates', description: 'Live resin, shatter, budder, and rosin. Potent, pure, and properly purged. For those who know the difference.', price: 0, image: '/categories/WAX.png', category: 'concentrates', route: '/wax' },
  { id: 5, title: 'Edibles', description: 'Infused, not sprayed. Real cannabis extract mixed into every batch for consistent dosing and authentic effects.', price: 0, image: '/categories/EDIBLES.png', category: 'edibles', route: '/edible' },
  { id: 6, title: 'Moonwater', description: 'Premium THC beverages from our friends in Asheville. Crisp, clean, and refreshing with a smooth onset.', price: 0, image: '/icons/Moonwater.png', category: 'moonwater', route: '/moonwater' },
  { id: 7, title: 'Apparel', description: 'Quality streetwear and accessories. Clean designs that rep the brand without looking like a walking billboard.', price: 0, image: '/343.png', category: 'apparel', route: '/apparel' }
];

export const stores: StoreItem[] = [
  {
    id: 1,
    name: "Salisbury",
    address: "111 W Bank Street",
    city: "Salisbury, NC 28144",
    image: "/stores/salisbury.jpg",
    hours: "Mon-Sat: 11am-9pm, Sun: 12pm-6pm",
    type: "store",
    gallery: [
      "/stores/salisbury/flora salisbury pics-1.jpg",
      "/stores/salisbury/flora salisbury pics-8.jpg",
      "/stores/salisbury/flora salisbury pics-12.jpg",
      "/stores/salisbury/flora salisbury pics-14.jpg"
    ]
  },
  {
    id: 2,
    name: "Charlotte - Monroe Road",
    address: "3130 Monroe Road",
    city: "Charlotte, NC 28205",
    image: "/stores/charlotte.jpg",
    hours: "Mon-Sat: 11am-9pm, Sun: 12pm-6pm",
    type: "store",
    gallery: [
      "/stores/charlotte/A7S08190.JPG",
      "/stores/charlotte/A7S08223.JPG",
      "/stores/charlotte/flora charlotte pics-16.jpg",
      "/stores/charlotte/flora charlotte pics-22.jpg"
    ]
  },
  {
    id: 3,
    name: "Charlotte - Nations Ford",
    address: "5115 Nations Ford Road",
    city: "Charlotte, NC 28217",
    image: "/stores/charlotte.jpg",
    hours: "Mon-Sat: 11am-9pm, Sun: 12pm-6pm",
    type: "store",
    gallery: [
      "/stores/charlotte/A7S08223 (3).JPG",
      "/stores/charlotte/flora charlotte pics-22.jpg",
      "/stores/charlotte/flora charlotte pics-16.jpg",
      "/stores/charlotte/A7S08190.JPG"
    ]
  },
  {
    id: 4,
    name: "Blowing Rock",
    address: "3894 US 321",
    city: "Blowing Rock, NC 28605",
    image: "/stores/blowing-rock.jpg",
    hours: "Mon-Sat: 11am-9pm, Sun: 12pm-6pm",
    type: "store",
    gallery: [
      "/stores/blowingrock/flora boone pics-1.jpg",
      "/stores/blowingrock/flora boone pics-6.jpg",
      "/stores/blowingrock/flora boone pics-10.jpg",
      "/stores/blowingrock/flora boone pics-12.jpg"
    ]
  },
  {
    id: 5,
    name: "Elizabethton",
    address: "2157 W Elk Ave",
    city: "Elizabethton, TN 37643",
    image: "/stores/elizabethton.jpg",
    hours: "Mon-Sat: 11am-9pm, Sun: 12pm-6pm",
    type: "store",
    gallery: [
      "/stores/elizabethton/flora elizabethton pics-1.jpg",
      "/stores/elizabethton/flora elizabethton pics-5.jpg",
      "/stores/elizabethton/flora elizabethton pics-8.jpg",
      "/stores/elizabethton/flora elizabethton pics-11.jpg"
    ]
  },
  {
    id: 6,
    type: "cta"
  }
];

export const storeCarouselImages = [
  { 
    id: 1, 
    name: "Charlotte", 
    image: "/stores/charlotte/A7S08223 (3).JPG",
    location: "Headquarters"
  },
  { 
    id: 2, 
    name: "Salisbury", 
    image: "/stores/salisbury.jpg",
    location: "Historic Downtown"
  },
  { 
    id: 3, 
    name: "Blowing Rock", 
    image: "/stores/blowing-rock.jpg",
    location: "Appalachian Mountains"
  },
  { 
    id: 4, 
    name: "Elizabethton", 
    image: "/stores/elizabethton.jpg",
    location: "Tennessee Valley"
  }
];

export const reviews = [
  {
    name: "Marcus T.",
    location: "Charlotte, NC",
    rating: 5,
    date: "2 days ago",
    review: "Finally, a dispensary that gets it. No games, no mystery strains, just premium flower that hits exactly how they say it will. Got my order in 24 hours.",
    verified: true,
    product: "Wedding Cake"
  },
  {
    name: "Sarah K.",
    location: "Raleigh, NC",
    rating: 5,
    date: "1 week ago",
    review: "The Moonwater line is insane. Tastes clean, hits smooth, and the packaging is next level. You can tell they actually care about what they're doing.",
    verified: true,
    product: "Moonwater Vape"
  },
  {
    name: "James D.",
    location: "Elizabethton, TN",
    rating: 5,
    date: "3 days ago",
    review: "Been buying from Flora for 2 years. Consistency is unmatched. Every eighth looks like it belongs in a magazine. Customer for life.",
    verified: true,
    product: "Gelato #33"
  },
  {
    name: "Ashley R.",
    location: "Boone, NC",
    rating: 5,
    date: "5 days ago",
    review: "Walked into the Blowing Rock store and was blown away. Clean, professional, knowledgeable staff. This is what legal cannabis should look like.",
    verified: true,
    product: "Pre-roll Pack"
  },
  {
    name: "Mike L.",
    location: "Greensboro, NC",
    rating: 5,
    date: "1 day ago",
    review: "Ordered at 1pm, had it by noon the next day. Flower was fresh, sticky, and absolutely fire. Flora doesn't miss.",
    verified: true,
    product: "Purple Punch"
  },
  {
    name: "Destiny W.",
    location: "Durham, NC",
    rating: 5,
    date: "4 days ago",
    review: "The edibles are perfectly dosed every time. No guessing games. Professional packaging, consistent effects. This is the future.",
    verified: true,
    product: "Gummies"
  }
]; 