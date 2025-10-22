import { createClient } from 'next-sanity'

// Reemplaza estos valores con los de tu proyecto de Sanity
export const projectId = 'v3mhzqk7'
export const dataset = 'production' // o el nombre de tu dataset
const apiVersion = '2023-05-03' // USA UNA FECHA RECIENTE

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // `false` si quieres datos frescos siempre
})
