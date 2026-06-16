import { PDFDocument } from 'pdf-lib'

/**
 * Merges multiple PDF ArrayBuffers into a single unified PDF Uint8Array.
 */
export async function mergePdfBuffers(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create()
  for (const buffer of buffers) {
    const pdf = await PDFDocument.load(buffer)
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    copiedPages.forEach((page) => mergedPdf.addPage(page))
  }
  return await mergedPdf.save()
}
