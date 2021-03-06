import shortid    from 'shortid'
import isEqual    from 'lodash.isequal'
import cloneDeep  from 'lodash.clonedeep'

import ActionType from '../constant/ActionType'
import FileFormat from '../constant/FileFormat'

const initial             =
{
  documents: [ ],
     active: null,
      nodes: { },
    running: null,
     status: [ ],
     errors: [ ]
}

const documentProcessor   = (state = initial, action) => {
  switch (action.type) {
    case ActionType.Asynchronous.READ_SUCCESS: {
      const meta          = action.payload
      var   active        = null

      if ( meta.output.format == FileFormat.PIPELINE )
      {
        const documents   = state.documents.slice().map((dokument) =>
        {
          const exists    = isEqual(dokument.output, meta.output)
          if ( exists )
          {
            const pipe    = [ ]
            meta.data.forEach((stage) =>
            {
              const node =
              {
                     ID: stage.ID,
                   code: stage.code,
                   name: stage.name,
                  //  icon: state.nodes[stage.code].icon,
                  label: stage.label,
                // onClick: state.nodes[stage.code].onClick,
                  value: stage.value,
                 status: stage.status
              }

              pipe.push(node)
            })

            dokument.data = pipe
            active        = dokument
          }

          return {...dokument, active: exists }
        })

        if ( !active ) {
          const pipe   = [ ]
          meta.data.forEach((stage) =>
          {
            const node =
            {
                   ID: stage.ID,
                 code: stage.code,
                 name: stage.name,
                //  icon: state.nodes[stage.code].icon,
                label: stage.label,
              // onClick: state.nodes[stage.code].onClick,
                value: stage.value,
               status: stage.status
            }

            pipe.push(node)
          })

          active       =
          {
                ID: shortid.generate(),
            output: meta.output,
              data: pipe,
            active: true
          }

          documents.push(active)
        }

        return {...state, documents: documents, active: active, errors: [ ] }
      }

      break
    }


    case ActionType.Asynchronous.WRITE_SUCCESS: {
      const meta          = action.payload.data
      var   active        = null

      if ( meta.output.format == FileFormat.PIPELINE )
      {
        const documents   = state.documents.slice().map((dokument) =>
        {
          const exists    = isEqual(dokument.output, meta.output)
          if ( exists )
          {
            const pipe    = [ ]
            meta.data.forEach((stage) =>
            {
              const node =
              {
                     ID: stage.ID,
                   code: stage.code,
                   name: stage.name,
                   icon: state.nodes[stage.code].icon,
                  label: stage.label,
                onClick: state.nodes[stage.code].onClick,
                  value: stage.value,
                 status: stage.status
              }

              pipe.push(node)
            })

            dokument.data = pipe
            active        = dokument
          }

          return {...dokument, active: exists }
        })

        if ( !active ) {
          const pipe   = [ ]
          meta.data.forEach((stage) =>
          {
            const node =
            {
                   ID: stage.ID,
                 code: stage.code,
                 name: stage.name,
                 icon: state.nodes[stage.code].icon,
                label: stage.label,
              onClick: state.nodes[stage.code].onClick,
                value: stage.value,
               status: stage.status
            }

            pipe.push(node)
          })

          active       =
          {
                ID: shortid.generate(),
            output: meta.output,
              data: pipe,
            active: true
          }

          documents.push(active)
        }

        return {...state, documents: documents, active: active, errors: [ ] }
      }

      break
    }

    case ActionType.DocumentProcessor.SET_ACTIVE_DOCUMENT:
    {
      const active       = action.payload
      const documents    = state.documents.slice().map((dokument) =>
      {
        return {...dokument, active: isEqual(dokument.output, active.output) }
      })

      return {...state, documents: documents, active: active, errors: [ ]}
    }

    case ActionType.DocumentProcessor.SET_STAGE:
    {
      const node         = action.payload
      var   nodes        = state.nodes

      if ( !state.nodes[node.code] )
      {
        nodes            = cloneDeep(state.nodes)
        nodes[node.code] =
        {
          onClick: node.onClick,
             icon: node.icon
        }
      }

      return {...state, nodes: nodes, errors: [ ] }
    }

    case ActionType.Pipeline.RUN_REQUEST:
      nprogress.set(0.0)
      return {...state, running: action.payload }

    case ActionType.Pipeline.RUN_SUCCESS:
      nprogress.set(1.0)
      return {...state, running: null }

    case ActionType.Pipeline.RUN_ERROR:
      nprogress.set(1.0)
      return {...state, running: null, errors: action.payload.error.errors }
  }

  return state
}

export default documentProcessor
