export const snapshot = {
  store: {
    'document:document': {
      gridSize: 10,
      name: '',
      meta: {},
      id: 'document:document',
      typeName: 'document',
    },
    'page:page': {
      meta: {},
      id: 'page:page',
      name: 'Page 1',
      index: 'a1',
      typeName: 'page',
    },
    'shape:DmYF3Vs1-CRN9Q27oV4CH': {
      x: 367.3973693847656,
      y: 165.7534637451172,
      rotation: 0,
      isLocked: false,
      opacity: 1,
      meta: {},
      id: 'shape:DmYF3Vs1-CRN9Q27oV4CH',
      type: 'geo',
      props: {
        w: 130.410888671875,
        h: 83.28764343261719,
        geo: 'rectangle',
        color: 'black',
        labelColor: 'black',
        fill: 'none',
        dash: 'draw',
        size: 'm',
        font: 'draw',
        text: 'start',
        align: 'middle',
        verticalAlign: 'middle',
        growY: 0,
        url: '',
      },
      parentId: 'page:page',
      index: 'a1',
      typeName: 'shape',
    },
    'shape:5h7DD5I6xpbeChD_5TYsH': {
      x: 378.3562316894531,
      y: 327.9452819824219,
      rotation: 0,
      isLocked: false,
      opacity: 1,
      meta: {},
      id: 'shape:5h7DD5I6xpbeChD_5TYsH',
      type: 'geo',
      props: {
        w: 120.54794311523438,
        h: 121.64382934570312,
        geo: 'diamond',
        color: 'black',
        labelColor: 'black',
        fill: 'none',
        dash: 'draw',
        size: 'm',
        font: 'draw',
        text: 'Is right?',
        align: 'middle',
        verticalAlign: 'middle',
        growY: 0,
        url: '',
      },
      parentId: 'page:page',
      index: 'a2',
      typeName: 'shape',
    },
    'shape:ha5trqbfRSApD0Ma-ZrqT': {
      x: 0,
      y: 0,
      rotation: 0,
      isLocked: false,
      opacity: 1,
      meta: {},
      id: 'shape:ha5trqbfRSApD0Ma-ZrqT',
      type: 'arrow',
      parentId: 'page:page',
      index: 'a3',
      props: {
        dash: 'draw',
        size: 'm',
        fill: 'none',
        color: 'black',
        labelColor: 'black',
        bend: 0,
        start: {
          type: 'binding',
          boundShapeId: 'shape:DmYF3Vs1-CRN9Q27oV4CH',
          normalizedAnchor: { x: 0.5, y: 0.5 },
          isExact: false,
        },
        end: {
          type: 'binding',
          boundShapeId: 'shape:5h7DD5I6xpbeChD_5TYsH',
          normalizedAnchor: { x: 0.57272636366283, y: 0.7747743679480183 },
          isExact: false,
        },
        arrowheadStart: 'none',
        arrowheadEnd: 'arrow',
        text: 'continue',
        font: 'draw',
      },
      typeName: 'shape',
    },
  },
  schema: {
    schemaVersion: 1,
    storeVersion: 4,
    recordVersions: {
      asset: {
        version: 1,
        subTypeKey: 'type',
        subTypeVersions: { image: 2, video: 2, bookmark: 0 },
      },
      camera: { version: 1 },
      document: { version: 2 },
      instance: { version: 21 },
      instance_page_state: { version: 5 },
      page: { version: 1 },
      shape: {
        version: 3,
        subTypeKey: 'type',
        subTypeVersions: {
          group: 0,
          text: 1,
          bookmark: 1,
          draw: 1,
          geo: 7,
          note: 4,
          line: 1,
          frame: 0,
          arrow: 1,
          highlight: 0,
          embed: 4,
          image: 2,
          video: 1,
        },
      },
      instance_presence: { version: 5 },
      pointer: { version: 1 },
    },
  },
};

const responsess = {
  shapes: [
    { type: 'ellipse', description: 'Start', id: '1' },
    {
      type: 'rectangle',
      description: 'Client sends a GraphQL query to the server',
      id: '2',
    },
    {
      type: 'diamond',
      description: 'Does the server have a GraphQL schema?',
      id: '3',
    },
    {
      type: 'rectangle',
      description: 'Server validates and parses the GraphQL query',
      id: '4',
    },
    {
      type: 'diamond',
      description: 'Is the query syntactically correct?',
      id: '5',
    },
    {
      type: 'rectangle',
      description: 'Server executes the GraphQL query against the data',
      id: '6',
    },
    {
      type: 'diamond',
      description: 'Does the query require authorization?',
      id: '7',
    },
    {
      type: 'rectangle',
      description:
        'Server checks if the client is authorized to execute the query',
      id: '8',
    },
    {
      type: 'rectangle',
      description: 'Server returns the requested data to the client',
      id: '9',
    },
    { type: 'ellipse', description: 'End', id: '10' },
  ],
  arrows: [
    { id: '1', start: '1', end: '2' },
    { id: '2', start: '2', end: '3' },
    { id: '3-true', start: '3', end: '4', description: 'Yes' },
    { id: '3-false', start: '3', end: '10', description: 'No' },
    { id: '4', start: '4', end: '5' },
    { id: '5-true', start: '5', end: '6', description: 'Yes' },
    { id: '5-false', start: '5', end: '10', description: 'No' },
    { id: '6', start: '6', end: '7' },
    { id: '7-true', start: '7', end: '8', description: 'Yes' },
    { id: '7-false', start: '7', end: '9', description: 'No' },
    { id: '8', start: '8', end: '9' },
    { id: '9', start: '9', end: '10' },
  ],
};
const createShape = (idT, x, y, type, text, parent) => {
  const id = `shape:shape-${idT}`;

  return {
    x: x,
    y: y,
    rotation: 0,
    isLocked: false,
    opacity: 1,
    meta: {},
    id: id,
    type: 'geo',
    props: {
      w: 400,
      h: 200,
      geo: type,
      color: 'black',
      labelColor: 'black',
      fill: 'none',
      dash: 'draw',
      size: 's',
      font: 'draw',
      text: text ?? '',
      align: 'middle',
      verticalAlign: 'middle',
      growY: 0,
      url: '',
    },
    parentId: parent,
    index: 'a1',
    typeName: 'shape',
  };
};

const createArrow = (idT, start, end, text, parent) => {
  const id = `shape:arrow-${idT}`;

  return {
    x: 0,
    y: 0,
    rotation: 0,
    isLocked: false,
    opacity: 1,
    meta: {},
    id: id,
    type: 'arrow',
    parentId: parent,
    index: 'a3',
    props: {
      dash: 'draw',
      size: 'm',
      fill: 'none',
      color: 'black',
      labelColor: 'black',
      bend: 0,
      start: {
        type: 'binding',
        boundShapeId: 'shape:shape-' + start,
        normalizedAnchor: { x: 0.5, y: 0.5 },
        isExact: false,
      },
      end: {
        type: 'binding',
        boundShapeId: 'shape:shape-' + end,
        normalizedAnchor: { x: 0.57272636366283, y: 0.7747743679480183 },
        isExact: false,
      },
      arrowheadStart: 'none',
      arrowheadEnd: 'arrow',
      text: text ?? '',
      font: 'draw',
    },
    typeName: 'shape',
  };
};

export const formatResponse = (editor, response) => {
  const allShape: any[] = [];

  const createGroup = 'shape:' + crypto.randomUUID();

  response.shapes.forEach((shape, index) => {
    allShape.push(
      createShape(
        shape.id,
        (() => {
          if (index % 2 == 0) {
            return 365;
          } else {
            return 0;
          }
        })(),
        165 + index * 200 * 2,
        shape.type,
        shape.description,
        createGroup,
      ),
    );
  });

  response.arrows.forEach((arrow) => {
    allShape.push(
      createArrow(
        arrow.id,
        arrow.start,
        arrow.end,
        arrow.description,
        createGroup,
      ),
    );
  });

  allShape.push({
    x: 1541.0184375679096,
    y: 212.86121054942242,
    rotation: 0,
    isLocked: false,
    opacity: 1,
    meta: {},
    id: createGroup,
    type: 'group',
    parentId: 'page:page',
    index: 'a3',
    props: {},
    typeName: 'shape',
  });

  console.log(allShape);

  const b = {
    store: {
      'document:document': {
        gridSize: 10,
        name: '',
        meta: {},
        id: 'document:document',
        typeName: 'document',
      },
      'page:page': {
        meta: {},
        id: 'page:page',
        name: 'Page 1',
        index: 'a1',
        typeName: 'page',
      },
    },
    schema: {
      schemaVersion: 1,
      storeVersion: 4,
      recordVersions: {
        asset: {
          version: 1,
          subTypeKey: 'type',
          subTypeVersions: { image: 2, video: 2, bookmark: 0 },
        },
        camera: { version: 1 },
        document: { version: 2 },
        instance: { version: 21 },
        instance_page_state: { version: 5 },
        page: { version: 1 },
        shape: {
          version: 3,
          subTypeKey: 'type',
          subTypeVersions: {
            group: 0,
            text: 1,
            bookmark: 1,
            draw: 1,
            geo: 7,
            note: 4,
            line: 1,
            frame: 0,
            arrow: 1,
            highlight: 0,
            embed: 4,
            image: 2,
            video: 1,
          },
        },
        instance_presence: { version: 5 },
        pointer: { version: 1 },
      },
    },
  };

  // Object.assign(
  //   b.store,
  //   Object.fromEntries(allShape.map((obj) => [obj.id, obj])),
  // );

  // allShape.forEach((item) => {
  //   b.store[item.sh.id] = item.sh;
  // });

  console.log(b);
  return allShape;
};
