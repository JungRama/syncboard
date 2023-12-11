export const initialName = (name: string) => {
  let words = name.split(' ');
  if (words.length > 1) {
    const initial = words[0].charAt(0) + words[1].charAt(0);
    return initial.toUpperCase();
  } else {
    const initial =
      words[0].charAt(0) + words[0].charAt(1) ?? words[0].charAt(0);
    return initial.toUpperCase();
  }
};

export const userProfile = (photo: string | null | undefined, text: string) => {
  const avatar = photo ?? `https://avatar.vercel.sh/vercel.svg?text=${text}`;
  return avatar;
};
