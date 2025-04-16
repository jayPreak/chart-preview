import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BarChart } from 'lucide-react';

function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[]>([]);

  // Generate new random data
  const generateData = () => {
    const newData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
    setData(newData);
  };

  useEffect(() => {
    // Initial data generation
    generateData();
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data) || 100])
      .range([innerHeight, 0]);

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create group for the chart
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add bars
    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (_, i) => xScale(i.toString()) || 0)
      .attr('y', d => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d))
      .attr('fill', '#3b82f6')
      .attr('rx', 4)
      .transition()
      .duration(500)
      .attr('opacity', 1);

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale));

  }, [data]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart className="w-6 h-6" />
            D3.js Bar Chart
          </h1>
          <button
            onClick={generateData}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Generate New Data
          </button>
        </div>
        <svg ref={svgRef} className="bg-white"></svg>
      </div>
    </div>
  );
}

export default App;