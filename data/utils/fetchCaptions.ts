export const fetchCaptions = async ({ pageParam, category, subCategoryId }) => {
    let res;
    switch (category) {
        case '1':
            res = await import('../../assets/content/captions-personal-life.json');
            break;
        case '3':
            res = await import('../../assets/content/captions-entertainment-fun.json');
            break;
        case '4':
            res = await import('../../assets/content/captions-education-inspiration.json');
            break;
        case '6':
            res = await import('../../assets/content/captions-community-engagement.json');
            break;
        case '9':
            res = await import('../../assets/content/captions-throwback-nostalgia.json');
            break;
        case '10':
            res = await import('../../assets/content/captions-affirmations-motivation.json');
            break;
        default:
            res = [];
            break;
    }

    const data = res.default;
    // console.log('Captions data', res[0]);

    const filteredData = subCategoryId
        ? data.filter((caption) => caption.subCategoryId === subCategoryId)
        : data;

    const pageSize = 10;
    const startIndex = pageParam * pageSize;

    return {
        captions: filteredData.slice(startIndex, (pageParam + 1) * pageSize),
        nextPage: (pageParam + 1) * pageSize < filteredData.length ? pageParam + 1 : undefined,
    };
};

/**
 * Fetch via API
 *  const fetchProjects = async ({ pageParam }) => {
    const res = await fetch('/api/projects?cursor=' + pageParam)
    return res.json()
  }
 */

/**
 * export const fetchCaptions = async ({ pageParam, category }) => {
  // Define a mapping of categories to JSON file paths
  const categoryToFileMap = {
      '1': '../../assets/content/captions-personal-life.json',
      '2': '../../assets/content/captions-entertainment-fun.json',
  };

  const filePath = categoryToFileMap[category];

  if (!filePath) {
      throw new Error(`Unsupported category: ${category}`);
  }

  // Dynamically import the file

  const res = await import(filePath);
  const data = res.default;
  // console.log('Captions data', res[0]);

  const pageSize = 10;
  const startIndex = pageParam * pageSize;

  return {
      captions: data.slice(startIndex, (pageParam + 1) * pageSize),
      nextPage: (pageParam + 1) * pageSize < data.length ? pageParam + 1 : undefined,
  };
};
 */