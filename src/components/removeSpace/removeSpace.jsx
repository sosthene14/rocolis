function remplacerEspacesParTirets(chaine) {
  if (chaine !== undefined) {
    return chaine.replace(/\s/g, '-');
  } else {
    return "";
  }
}

export default remplacerEspacesParTirets;
