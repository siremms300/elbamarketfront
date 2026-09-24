'use client';

interface CategoryFilterProps {
  categories: {
    _id: string;
    name: string;
    slug: string;
    postCount: number;
  }[];
  selected: string;
  onSelect: (slug: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex gap-2 overflow-x-auto">
      <button
        onClick={() => onSelect('')}
        className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          selected === ''
            ? 'bg-elba-primary text-white'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        }`}
      >
        All Posts
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelect(cat.slug)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selected === cat.slug
              ? 'bg-elba-primary text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {cat.name} ({cat.postCount})
        </button>
      ))}
    </div>
  );
}