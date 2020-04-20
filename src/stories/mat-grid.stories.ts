import { storiesOf } from '@storybook/angular'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Foundation|Grid', module)
  .add(
    'Responsive',
    () => ({
      styles: [
        `
      .row {
        margin: 20px 0;
      }
      .col {
        border:1px solid lightcoral
      }
      .container {
        border:1px solid red
      }
      `,
      ],
      template: `
      <div class="container" >
        <div class="row">
          <div class="col l4 m2 s4" >
            12 of 12 columns/ 2 of 8 columns / 4 of 4 columns
          </div>
          <div class="col l4 m4 s4" >
           12 of 12 columns/ 4 of 8 columns / 4 of 4 columns
          </div>
          <div class="col l4 m2 s4" >
           12 of 12 columns/ 2 of 8 columns / 4 of 4 columns
          </div>
        </div>
      </div>
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'Push',
    () => ({
      styles: [
        `
      .row {
        margin: 20px 0;
      }
      .col {
        border:1px solid lightcoral
      }
      .container {
        border:1px solid red
      }
      `,
      ],
      template: `
      <div class="container" >
        <div class="row">
          <div class="col l4 m4 s3 push-l6 push-m4 push-s1" >
            Pushed elements
          </div>
        </div>
      </div>
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'Pull',
    () => ({
      styles: [
        `
      .row {
        margin: 20px 0;
      }
      .col {
        border:1px solid lightcoral
      }
      .container {
        border:1px solid red
      }
      `,
      ],
      template: `
      <div class="container" >
        <div class="row">
         <div class="col l6 m4 s1 push-l6 push-m4 push-s3" >
            Pushed element
          </div>
          <div class="col l6 m4 s1 pull-l6 pull-m4 pull-s1" >
            Pull element
          </div>
        </div>
      </div>
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'Offset',
    () => ({
      styles: [
        `
      .row {
        margin: 20px 0;
      }
      .col {
        border:1px solid lightcoral
      }
      .container {
        border:1px solid red
      }
      `,
      ],
      template: `
      <div class="container" >
        <div class="row">
         <div class="col l6 m4 s1 offset-l6 offset-m4 offset-s3" >
             Element with offset
          </div>
        </div>
      </div>
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'Vertical alignment',
    () => ({
      styles: [
        `
      .row {
        margin: 20px 0;
      }
      .col {
        border:1px solid lightcoral
      }
      .container {
        border:1px solid red
      }
      `,
      ],
      template: `
      <div class="container" >
        <div class="row baseline" style="height: 200px">
         <div class="col l6" >
            row baseline
          </div>
        </div>
      </div>
      <div class="container" >
      <div class="row middle" style="height: 200px">
       <div class="col l6" >
          row middle
        </div>
      </div>
    </div>
    <div class="container" >
    <div class="row end" style="height: 200px">
     <div class="col l6" >
        row end
      </div>
    </div>
  </div>
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'Horizontal alignment',
    () => ({
      styles: [
        `
      .row {
        margin: 20px 0;
      }
      .col {
        border:1px solid lightcoral
      }
      .container {
        border:1px solid red
      }
      `,
      ],
      template: `
      <div class="container">
        <div class="row space-around">
         <div class="col l3" >
            row space-around
          </div>
        </div>
        <div class="row h-end">
          <div class="col l3" >
           row h-end
          </div>
          <div class="col l3" >
          row h-end
         </div>
       </div>
       <div class="row h-baseline">
        <div class="col l3" >
          row h-baseline
        </div>
        <div class="col l3" >
        row h-baseline
        </div>
      </div>
     <div class="row space-around">
     <div class="col l3" >
      row space-around
    </div>
    <div class="col l3" >
     row space-around
     </div>
  </div>
  <div class="row space-between">
  <div class="col l3" >
   row space-between
 </div>
 <div class="col l3" >
  row space-between
  </div>
</div>
<div class="row space-evenly">
<div class="col l3" >
 row space-evenly
</div>
<div class="col l3" >
row space-evenly
</div>
</div>
      </div>

    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'Nesting',
    () => ({
      styles: [
        `
      .row {
        margin: 20px 0;
      }
      .col {
        border:1px solid lightcoral
      }
      .container {
        border:1px solid red
      }
      `,
      ],
      template: `
    <div class="container" >
      <div class="row" >
        <div class="col l12"  >
        Level 0
        <div class="row space-around middle">
        <div class="col l5">
          <div class="row" style=" background-color: white;">
            <div class="col l12" >
              Nested Level 1
            </div>
            <div class="col l4" >
              Nested Level 1
            </div>
            <div class="col l8" >
              <div class="row" style="height:100px; background-color: lightcyan;">
                <div class="col l12" >
                  Nested  Level 2
                </div>
                <div class="col l4" >
                  Nested  Level 2
                </div>
                <div class="col l8" >
                  Nested  Level 2
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>

    </div>    
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'Grid use example',
    () => ({
      styles: [
        `
      .row {
        margin: 20px 0;
      }
      .col {
        border:1px solid lightcoral
      }
      .container {
        border:1px solid red
      }
      `,
      ],
      template: `
    <div class="container">
    <div class="row">
      <div class="col s4 l12" ><p>s4</p></div>
      <div class="col s4 m4 l2" ><p>s4 m4 l2</p></div>
      <div class="col s4 m4 l8" ><p>s4 m4 l8</p></div>
      <div class="col s4 m4 l2" ><p>s4 m4 l2</p></div>
    </div>
    <div class="row">
      <div class="col s4 m8 l3" ><p>s4 m8 l3</p></div>
      <div class="col s4 m6 l3" ><p>s4 m8 l3</p></div>
      <div class="col s4 m6 l3" ><p>s4 m8 l3</p></div>
      <div class="col s4 m6 l3" ><p>s4 m8 l3</p></div>
    </div>
    </div>
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'No gutters',
    () => ({
      styles: [
        `
      .row {
        margin: 20px 0;
      }
      .col {
        border:1px solid lightcoral
      }
      .container {
        border:1px solid red
      }
      `,
      ],
      template: `
    <div class="container">
    <div class="row">
      <div class="col l12 m8 s4" >regular</div>
      <div class="col l12 m8 s4 no-gutters" >no-gutters</div>
    </div>
    </div>
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'No wrap',
    () => ({
      styles: [
        `
      .row {
        margin: 20px 0;
      }
      .col {
        border:1px solid lightcoral
      }
      .container {
        border:1px solid red
      }
      `,
      ],
      template: `
    <div class="container">
       <div class="row">
          <div class="col l5 m8 s4" >
          <div class="row ">
          <div class="col l12 m8 s4" > regular</div>
          <div class="col l12 m8 s4 " >regular (normally wrap)</div>
        </div>
      </div>
      <div class="row">
          <div class="col l5 m8 s4" >
          <div class="row no-wrap">
          <div class="col l12 m8 s4" > no-wrap</div>
          <div class="col l12 m8 s4 " >no-wrap (normally wrap)</div>
        </div>
      </div>
    </div>
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
