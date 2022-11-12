<script>
  import { fade } from "svelte/transition"
  let isOpen = false

  export async function toggle() {
    isOpen = !isOpen
  }

  export async function close() {
    isOpen = false
  }
</script>

{#if isOpen}
  <div
    class="modal show"
    id="centeredModalPrimary"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    transition:fade
    on:click|self={async () => await close()}
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <!-- <h5 class="modal-title">Centered modal</h5> -->
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            on:click|self={async () => await close()}
          />
        </div>

        {#if $$slots.body}
          <div class="modal-body m-3">
            <slot name="body" />
          </div>
        {/if}
        {#if $$slots.footer}
          <div class="modal-footer">
            <slot name="footer" />
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    display: block;
    height: 100%;
    left: 0;
    outline: 0;
    overflow-x: hidden;
    overflow-y: auto;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1055;
  }

  .modal.show .modal-dialog {
    transform: none;
  }
  .modal-dialog-centered {
    align-items: center;
    display: flex;
    min-height: calc(100% - 1rem);
  }
  .modal-dialog {
    margin: 0.5rem;
    pointer-events: none;
    position: relative;
    width: auto;
  }
  .modal-content {
    background-clip: padding-box;
    background-color: #fff;
    border: 0 solid rgba(0, 0, 0, 0.2);
    border-radius: 0.3rem;
    display: flex;
    flex-direction: column;
    outline: 0;
    pointer-events: auto;
    position: relative;
    width: 100%;
  }
  .modal-header {
    align-items: center;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    padding: 1rem;
  }
  .modal-header .btn-close {
    margin: -0.5rem -0.5rem -0.5rem auto;
    padding: 0.5rem;
  }
  [type="button"]:not(:disabled),
  button:not(:disabled) {
    cursor: pointer;
  }

  /* .modal-body {
    flex: 1 1 auto;
    padding: 1rem;
    position: relative;
  } */

  @media (min-width: 576px) {
    .modal-dialog-centered {
      min-height: calc(100% - 3.5rem);
    }
    .modal-dialog {
      margin: 1.75rem auto;
      max-width: 600px;
    }
  }
</style>
