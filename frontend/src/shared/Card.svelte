<script>
  export let image;
  export let title;
</script>

<div class="card">
  <img class="card-img-top" src={image} alt={title} />
  <div class="card-header">
    <h5 class="card-title mb-0">{title}</h5>
  </div>
  <div class="card-body">
    <slot />
  </div>
</div>
