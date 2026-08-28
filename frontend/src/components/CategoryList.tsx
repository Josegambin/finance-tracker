import type {
  Category
} from '../types/category';

interface CategoryListProps {

  categories: Category[];

  onDelete: (
    id: number
  ) => Promise<void>;

}

export default function CategoryList({
  categories,
  onDelete
}: CategoryListProps) {

  if (categories.length === 0) {

    return (
      <div className="empty-state">

        <span>📂</span>

        <h3>No categories yet</h3>

        <p>
          Create your first category
          to start organizing your finances.
        </p>

      </div>
    );
  }

  return (

    <div className="category-list">

      {categories.map((category) => (

        <div
          className="category-card"
          key={category.id}
        >

          <div className="category-info">

            <div
              className={
                category.type === 'INCOME'
                  ? 'category-icon income'
                  : 'category-icon expense'
              }
            >

              {category.type === 'INCOME'
                ? '↗'
                : '↘'}

            </div>

            <div>

              <h3>
                {category.name}
              </h3>

              <span
                className={
                  category.type === 'INCOME'
                    ? 'badge income'
                    : 'badge expense'
                }
              >

                {category.type}

              </span>

            </div>

          </div>

          <button
            className="delete-button"
            onClick={() =>
              onDelete(category.id)
            }
          >

            🗑

          </button>

        </div>

      ))}

    </div>

  );
}