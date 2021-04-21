import React, { FunctionComponent } from 'react';
import Masonry from 'react-masonry-css';

import { mansonrySettings } from '@web/subjects/constants';

const MasonryGrid: FunctionComponent = ({ children }) => {
  return (
    <Masonry
      breakpointCols={mansonrySettings.breakpointCols}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {children}
    </Masonry>
  );
};

export default MasonryGrid;
