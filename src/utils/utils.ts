export function extractValues(filters: string) {
  const regex = {
    saturate: /saturate\((\d+)%\)/,
    brightness: /brightness\((\d+)%\)/,
    contrast: /contrast\((\d+)%\)/,
    hueRotate: /hue-rotate\((\d+)deg\)/,
  };

  const resultados = {
    saturate: parseInt(filters.match(regex.saturate)?.[1], 10) ?? 100,
    brightness: parseInt(filters.match(regex.brightness)?.[1], 10) ?? 100,
    contrast: parseInt(filters.match(regex.contrast)?.[1], 10) ?? 100,
    hueRotate: parseInt(filters.match(regex.hueRotate)?.[1], 10) ?? 0,
  };

  return resultados;
}

export const updateTransform = (
  transformString: string,
  transformationType: string,
  newValue: string | number
) => {
  const regex = new RegExp(`(${transformationType}\\([^\\)]+\\))`, "g");
  if (transformationType === "rotate") {
    return transformString.replace(
      regex,
      `${transformationType}(${newValue}deg)`
    );
  }
  return transformString.replace(regex, `${transformationType}(${newValue})`);
};

export const extractNumbersToTransform = (
  transformString: string
): {
  scale?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  rotate?: number;
} => {
  const regex = /(scale|translateX|translateY|translateZ|rotate)\(([^)]+)\)/g;
  let match;
  const transformations = {};
  while ((match = regex.exec(transformString)) !== null) {
    const transformType = match[1];
    const transformValue = match[2];
    if (transformType === "rotate") {
      transformations[transformType] = transformValue.replace("deg", "");
    } else {
      transformations[transformType] = transformValue;
    }
  }
  return transformations;
};

export const extractNumbersToShadow = (
  shadowString: string
): {
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  color?: string;
} => {
  const regex = /(-?\d+px) (-?\d+px) (\d+px) (#[0-9a-fA-F]{3,6})/;
  const match = shadowString.match(regex);
  if (match) {
    const [_, offsetX, offsetY, blurRadius, color] = match;
    return {
      offsetX: parseInt(offsetX, 10),
      offsetY: parseInt(offsetY, 10),
      blur: parseInt(blurRadius, 10),
      color: color,
    };
  } else {
    return null;
  }
};
