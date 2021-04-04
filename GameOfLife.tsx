// conway's game of life, just needed to learn setting state arrays efficiently
// thanks Ben Awad
import React, { useCallback, useRef, useState } from 'react';
// $ npm i immer
import produce from 'immer';
import { promises } from 'node:fs';
interface GameOfLifeProps {

}

const numRows = 50;
const numColumns = 50;

const gridCheckOperations = [
  [0, 1],     // north of check cell
  [0, -1],    // south of check cell
  [1, 0],     // west of check cell
  [-1, 0],    // east of check cell
  [1, 1],     // north-west of check cell
  [-1, -1],   // south-east of check cell
  [1, -1],    // nort-east of check cell
  [-1, 1],    // south-west of check cell
]

export const GameOfLife: React.FC<GameOfLifeProps> = ({}) => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for(let x = 0; x < numRows; x++) {
      let column = Array.from(Array(numColumns), () => 0) // 1 = active, 0 = inactive, column is just an array of 0s
      rows.push(column)
    }

    return rows;
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running); // using ref to to accesses running in game loop
  runningRef.current = running 

  // useCallback with an empty array will make sure this function is only rendered once, passing state args will re-render the function based on state change
  // we only want the game loop to start once
  const runSimulation = useCallback(() => { 
    if(!runningRef.current) {
      return
    }    

    // RULES:
    //  1. any living cell with fewer than 2 living neighbors dies, as if by underpopulation
    //  2. any living cell with 2 or 3 live neighbors lives on to the next generation
    //  3. any living cells with more than 3 live neighbors dies, as if by overpopulation
    //  4. any dead cell with exactly 3 live neighbors becomes a live cell, as if by reproduction

    // CONDENSED RULES:
    //  1. any living cell with 2 or 3 neighbors survives
    //  2. any dead cell with 3 live neighbors becomes a live cell
    //  3. all other live cells die in the next generation, similarly all dead cells stay dead


    // mutations happen directly in the setGrid function because we need constant access to the current grid
    setGrid((currentGrid) => {
      // produce gives us a copy of the current grid that we can mutate 
      // by returning produce we're actually returning what the produce callback function returns (the new, mutated, grid)
      return produce(currentGrid, (gridCopy) => {
        // compute the neighbors and apply rules for every cell in the grid
        for(let x = 0; x < numRows; x++) {
          for (let y = 0; y < numColumns; y++) {
            let livingNeighbors = 0;
            gridCheckOperations.forEach(([neighborX, neighborY]) => {
              const checkX = x + neighborX;
              const checkY = y + neighborY;

              // check bounds
              if(checkX >= 0 && checkX < numRows && checkY >= 0 && checkY < numColumns) {
                livingNeighbors += currentGrid[checkX][checkY] // if the neighbor is alive, add 1 to the cell's alive neigbors
              }  
            })
            // fewer than 2 dies, more than 3 dies - covers rules 1 and 3
            if(livingNeighbors < 2 || livingNeighbors > 3) {
              gridCopy[x][y] = 0;
            }
            // if current cell is dead but has 3 living neigubors we bring it to life - covers rule 4
            else if(currentGrid[x][y] === 0 && livingNeighbors === 3) {
              gridCopy[x][y] = 1;
            }
          }
        }
      })
    })


    setTimeout(runSimulation, 100); // one second timeout on recursion for game loop
  }, [])


  const clearGrid = () => {
    setGrid((currentGrid) => {
      return produce(currentGrid, (gridCopy) => {
        for(let x = 0; x < numRows; x++) {
          for(let y = 0; y < numColumns; y++) {
            gridCopy[x][y] = 0;
          }
        }
      })
    })
  }

  const randomGrid = () => {
    setGrid( (currentGrid) => {
      return produce(currentGrid, (gridCopy) => {
        for(let x = 0; x < numRows; x++){
          for(let y = 0; y < numColumns; y++) {
            gridCopy[x][y] = Math.random() < 0.5 ? 1 : 0
          }
        }
      })
    })
  }


  return (
    <>
      <button onClick={() => {
        setRunning(!running);

        if(!running) {
          runningRef.current = true;
          runSimulation();
        }
      }}>{ !running ? 'start' : 'stop' }</button>
      <button onClick={clearGrid}>
        clear
      </button>
      <button onClick={randomGrid}>
        randomize
      </button>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numColumns}, 20px)` // 20px is size of box
      }}>
        {
          grid.map( (rows, xIndex) => {
            return rows.map( (col, yIndex) => (
              <div 
              onClick={() => {
                // produce by 'immer' allows you to create a mutable copy of your state that you can change (and later reflect changes from) without changing the origin base state
                const newGrid = produce(grid, (gridCopy: typeof grid)=> {
                  gridCopy[xIndex][yIndex] = gridCopy[xIndex][yIndex] === 1 ? 0 : 1;
                })

                // rather than mutating our grid state directly we create a copy of it using produce, mutate that, then set the grid to the new copy
                setGrid(newGrid); 
              }}
              style={{
                width: 20, 
                height: 20, 
                backgroundColor: grid[xIndex][yIndex] === 1 ? 'red' : undefined,
                border: 'solid 1px black'
              }} key={`Box(${xIndex},${yIndex})`}/>
            )) 
          })
        }
      </div>
    </>
  );
}
