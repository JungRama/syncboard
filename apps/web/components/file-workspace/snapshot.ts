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
    {
      type: 'ellipse',
      description: 'Start',
      id: '795b2064-7b3c-4e8d-b53e-13665d03a865',
    },
    {
      type: 'rectangle',
      description: 'Validate refresh token',
      id: '57c0d49b-aecc-4b43-b9d9-704b00522df4',
    },
    {
      type: 'diamond',
      description: 'Valid refresh token?',
      id: '9e849c15-4df3-44bc-aae2-5748a49c1a50',
    },
    {
      type: 'rectangle',
      description: 'Generate new access token',
      id: 'f5b84ff2-402a-4bfb-9b9b-3cdc8a187e38',
    },
    {
      type: 'rectangle',
      description: 'Send new access token',
      id: '47d6b518-6907-45a5-b7f4-93f681d7508b',
    },
    {
      type: 'ellipse',
      description: 'End',
      id: 'f8f951f9-443e-4aa1-a599-f557cd2689fd',
    },
  ],
  arrows: [
    {
      id: '8eac3323-72f5-4012-93dc-bcb8d5aecf53',
      start: '795b2064-7b3c-4e8d-b53e-13665d03a865',
      end: '57c0d49b-aecc-4b43-b9d9-704b00522df4',
      description: 'Start the process by validating the refresh token',
    },
    {
      id: 'f8f951f9-443e-4aa1-a599-f557cd2689fd',
      start: '47d6b518-6907-45a5-b7f4-93f681d7508b',
      end: 'f8f951f9-443e-4aa1-a599-f557cd2689fd',
      description: 'Process completed, end the flow',
    },
    {
      id: 'b720a7c7-8da6-4ad0-8a6c-6a475c9657e0',
      start: '57c0d49b-aecc-4b43-b9d9-704b00522df4',
      end: '9e849c15-4df3-44bc-aae2-5748a49c1a50',
      description: 'If refresh token is valid, proceed, else stop',
    },
    {
      id: '9574baa3-30aa-4c15-81e5-982cc32aaaa4',
      start: '9e849c15-4df3-44bc-aae2-5748a49c1a50',
      end: 'f5b84ff2-402a-4bfb-9b9b-3cdc8a187e38',
      description: 'If valid, generate new access token',
    },
    {
      id: '4e4a355a-5f50-4911-8dce-8f3a7adad5e5',
      start: 'f5b84ff2-402a-4bfb-9b9b-3cdc8a187e38',
      end: '47d6b518-6907-45a5-b7f4-93f681d7508b',
      description: 'Send the newly generated access token',
    },
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
