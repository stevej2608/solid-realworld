export type IErrors = { [key: string]: Exception }

interface IListErrorsProps {
  errors: IErrors
}

export const ListErrors = (props: IListErrorsProps) => (
  <Show when={props.errors}>
    <ul class="error-messages">
      <For each={Object.keys(props.errors)}>
        {(key: string) => (
          <li>
            {key} {props.errors[key]}
          </li>
        )}
      </For>
    </ul>
  </Show>
)
