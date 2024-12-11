interface TranslationFileWriter {
  persist: (data: { [localeCode: string]: Record<string, string> }) => void;
}

export default TranslationFileWriter;
