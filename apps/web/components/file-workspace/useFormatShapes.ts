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

export const formatShapes = (editor, response) => {
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

  return allShape;
};
