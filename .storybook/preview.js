export const parameters = {
  options: {
    storySort: (a, b) => {
      const x = a[1].kind.split('/').pop()
      const y = b[1].kind.split('/').pop()
      return x.localeCompare(y)
    },
  },
}
