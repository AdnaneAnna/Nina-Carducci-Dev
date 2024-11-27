(function($) {
  $.fn.mauGallery = function(options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));

      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }

      // Parcourir chaque image de la galerie
      $(this)
        .children(".gallery-item")
        .each(function() {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");

          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      // Créer les filtres si nécessaire
      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags($(this), options.tagsPosition, tagsCollection);

        // Attacher les clics pour les filtres
        $(document).off("click", ".tags-bar .nav-link").on("click", ".tags-bar .nav-link", function() {
          $.fn.mauGallery.methods.filterByTag($(this));
        });
      }

      // Attacher les clics pour les images (ouverture modale)
      $(document).off("click", ".gallery-item").on("click", ".gallery-item", function() {
        const lightboxId = options.lightboxId || "galleryLightbox";
        $.fn.mauGallery.methods.openLightBox($(this), lightboxId);
      });

      // Attacher les clics pour la navigation dans la modale
      $(document).off("click", ".mg-prev").on("click", ".mg-prev", function() {
        const lightboxId = options.lightboxId || "galleryLightbox";
        $.fn.mauGallery.methods.prevImage(lightboxId);
      });

      $(document).off("click", ".mg-next").on("click", ".mg-next", function() {
        const lightboxId = options.lightboxId || "galleryLightbox";
        $.fn.mauGallery.methods.nextImage(lightboxId);
      });

      // Afficher la galerie une fois prête
      $(this).fadeIn(500);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: "galleryLightbox",
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (
        !element
          .children()
          .first()
          .hasClass("row")
      ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },
    prevImage(lightboxId) {
      let activeImage = $(`#${lightboxId}`).find(".lightboxImage").attr("src");
      let imagesCollection = [];

      $(".gallery-item").each(function() {
        imagesCollection.push($(this).attr("src"));
      });

      let currentIndex = imagesCollection.indexOf(activeImage);
      let prevIndex = (currentIndex - 1 + imagesCollection.length) % imagesCollection.length;

      $(`#${lightboxId}`).find(".lightboxImage").attr("src", imagesCollection[prevIndex]);
    },
    nextImage(lightboxId) {
      let activeImage = $(`#${lightboxId}`).find(".lightboxImage").attr("src");
      let imagesCollection = [];

      $(".gallery-item").each(function() {
        imagesCollection.push($(this).attr("src"));
      });

      let currentIndex = imagesCollection.indexOf(activeImage);
      let nextIndex = (currentIndex + 1) % imagesCollection.length;

      $(`#${lightboxId}`).find(".lightboxImage").attr("src", imagesCollection[nextIndex]);
    },
    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${lightboxId}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-body">
              ${
                navigation
                  ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:10px;z-index:1000;">&#10094;</div>'
                  : ''
              }
              <img class="lightboxImage img-fluid" alt="Image affichée dans la modale" />
              ${
                navigation
                  ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:10px;z-index:1000;">&#10095;</div>'
                  : ''
              }
            </div>
          </div>
        </div>
      </div>`);
    },
    showItemTags(gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item">
                      <span class="nav-link" data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      }
    },
    filterByTag(clickedTag) {
      $(".tags-bar .nav-link").removeClass("active active-tag");
      clickedTag.addClass("active active-tag");

      var tag = clickedTag.data("images-toggle");

      $(".gallery-item").each(function() {
        $(this).parents(".item-column").hide();
        if (tag === "all") {
          $(this).parents(".item-column").show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this).parents(".item-column").show(300);
        }
      });
    }
  };
})(jQuery);
