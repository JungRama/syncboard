export const initialName = (name: string) => {
  let words = name.split(' ');
  if (words.length > 1) {
    return words[0].charAt(0) + words[1].charAt(0);
  } else {
    return words[0].charAt(0);
  }
};

export const userProfile = (photo: string | null | undefined, text: string) => {
  const avatar = photo ?? `https://avatar.vercel.sh/vercel.svg?text=${text}`;
  return avatar;
};
