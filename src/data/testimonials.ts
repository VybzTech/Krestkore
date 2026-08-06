export interface Testimonial {
  name: string
  image: string
  text: string
}

export const testimonials: readonly Testimonial[] = [
  {
    name: 'Oluwafemi',
    image: '/assets/alec-whitten.jfif',
    text: 'Working with Krestkore Solutions Limited has been a great experience. Their team is highly professional, responsive, and knowledgeable. They helped streamline our technology setup and provided reliable IT support every step of the way.',
  },
  {
    name: 'Adeyemi',
    image: '/assets/kari-rasmussen.jfif',
    text: 'Beyond fixing the immediate issues, they also provided preventive maintenance recommendations that have helped improve the reliability and lifespan of our systems. Their responsiveness and technical expertise minimized downtime and allowed our operations to continue without disruption.',
  },
  {
    name: 'Nifemi',
    image: '/assets/alisa-hester.jfif',
    text: 'Their insights helped us make informed technology decisions, optimize our processes, and improve overall efficiency. What stood out most was their ability to explain technical concepts in a clear and actionable manner, making the entire process straightforward and productive.',
  },
  {
    name: 'Peace',
    image: '/assets/nala-goins.jfif',
    text: 'What stood out most was their commitment to understanding our needs and delivering solutions that genuinely improved our operations. Thanks to their expertise, we can focus on growing our business with confidence.',
  },
]
