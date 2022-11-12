<script>
  import { createEventDispatcher } from "svelte"

  export let links

  const dispatch = createEventDispatcher()
</script>

<nav id="sidebar" class="sidebar js-sidebar">
  <div class="sidebar-content js-simplebar">
    <a class="sidebar-brand" href="#home">
      <span class="align-middle">HomeSec</span>
    </a>

    <ul class="sidebar-nav">
      <li class="sidebar-header">Pages</li>

      {#each links as link}
        <li
          class="sidebar-item"
          on:click={() => dispatch("tabChange", link.class)}
        >
          <a href={`#${link.class}`} class={`${link.class} sidebar-link`}>
            <!-- <i class="align-middle" data-feather="sliders" /> -->
            <span class="align-middle">{link.title}</span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>
